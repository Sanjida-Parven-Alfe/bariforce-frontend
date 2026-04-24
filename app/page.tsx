import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (<>
   <h1>hello </h1>
   <h1>hello merin</h1>
   <a href="/about">about page</a>
    <a href="/product">about page</a>
    <Link href="/product/8"> PRODUCT</Link>

    <Image src="/MERIN.jpg" alt="sample image" width={500} height={300}/>

   </>
  );
}
