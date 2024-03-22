const { default: axios } = require("axios");
const { User, Item, Bid, Order, sequelize } = require("../models/index");
const midtransClient = require("midtrans-client");

module.exports = class PublicController {
   static async getAllItems(req, res, next) {
      try {
         const items = await Item.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
         });

         res.status(200).json(items);
      } catch (error) {
         next(error);
      }
   }

   static async getUserById(req, res, next) {
      try {
         const user = await User.findByPk(req.params.id);
         res.status(200).json(user);
      } catch (error) {
         next(error);
      }
   }

   static async getItemById(req, res, next) {
      try {
         const item = await Item.findByPk(req.params.id);

         if (!item) {
            throw { name: "NotFound" };
         }

         res.status(200).json(item);
      } catch (error) {
         next(error);
      }
   }

   static async bidItem(req, res, next) {
      try {
         const { amount } = req.body;
         const { id: ItemId } = req.params;
         const UserId = req.user.id;

         const bid = await Bid.create({
            UserId,
            ItemId,
            amount,
         });

         res.status(201).json({ message: "Bid has been placed", bid });
      } catch (error) {
         next(error);
      }
   }

   static async getAllHighestBidsByUserId(req, res, next) {
      const UserId = req.params.id;
      try {
         const bids = await Bid.findAll({
            where: { UserId },
            include: {
               model: Item,
            },
            order: [["amount", "DESC"]],
         });

         if (bids.length === 0) {
            throw { name: "bidNotAvailable" };
         }

         const highestBids = bids.reduce((acc, bid) => {
            const existingBid = acc.find((b) => b.ItemId === bid.ItemId);
            if (!existingBid) {
               acc.push(bid);
            }
            return acc;
         }, []);

         res.status(200).json(highestBids);
      } catch (error) {
         next(error);
      }
   }

   static async getHighestBidById(req, res, next) {
      try {
         const { id } = req.params;

         const highestBid = await Bid.findAll({
            where: { ItemId: id },
            include: User,
         });

         if (!highestBid) {
            throw { name: "highestBidNotAvailable" };
         }

         highestBid.sort((a, b) => b.amount - a.amount);

         res.status(200).json(highestBid);
      } catch (error) {
         next(error);
      }
   }

   static async initiateMidtransTrx(req, res, next) {
      const highestAmount  = await Bid.findByPk(req.params.id)
      const OrderId = Math.random().toString();
      const amount = highestAmount.amount;
      // console.log(amount);
      try {
         let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: "SB-Mid-server-80reExAd7AJo_FbbElP2C301",
         });

         let parameter = {
            transaction_details: {
               order_id: OrderId,
               gross_amount: amount,
            },
            credit_card: {
               secure: true,
            },
            customer_details: {
               first_name: req.user.firstname,
               email: req.user.email,
            },
         };

         const transaction = await snap.createTransaction(parameter);
         let transactionToken = transaction.token;
         await Order.create({
            OrderId,
            amount,
            UserrId: req.user.id,
         });
         // console.log("transactionToken:", transactionToken);
         res.json({ message: "Order created", transactionToken, OrderId });
      } catch (error) {
         next(error);
      }
   }
   static async upgradeAccount(req, res, next) {
      const { OrderId } = req.body;
      try {
         const order = await Order.findOne({ where: { OrderId } });
         if (!order) {
            return res.status(404).json({ message: "Order not found" });
         }
        //  if (req.user.role === "Premium") {
        //     return res.status(400).json({ message: "You are already premium" });
        //  }
         if (order.status === "paid") {
            return res.status(400).json({ message: "Order already paid" });
         }
         //  console.log(order, "<<<<<<");
         const serverKey = "SB-Mid-server-80reExAd7AJo_FbbElP2C301";
         const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");
         const { data } = await axios.get(`https://api.sandbox.midtrans.com/v2/${OrderId}/status`, {
            headers: {
               Authorization: `Basic ${base64ServerKey}`,
            },
         });

         if (data.transaction_status === "capture" && data.status_code === "200") {
            // await req.user.update({ role: "Premium" });
            const {id} = req.params
            await Bid.destroy({where: {id}})

            await order.update({ status: "paid", paidDate: new Date() });
            res.json({ message: "Upgrade success" });
         } else {
            res.status(400).json({ message: "Upgrade failed, please call our customer support", midtransMessage: data.status_message });
         }
      } catch (error) {
         next(error);
      }
   }
};
