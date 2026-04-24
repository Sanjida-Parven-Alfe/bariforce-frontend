export default async function ProductPage({params}:{params :{id:string}}) {
 const product = await params;
 return (<>
   <h1>Product id is:{product.id}</h1>  
   <p>Book now{product.id}</p>
   </>
  );
}