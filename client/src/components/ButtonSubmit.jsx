export default function ButtonSubmit({ message }) {
   return (
      <>
         <button type="submit" className="btn btn-primary">
            {message}
         </button>
      </>
   );
}