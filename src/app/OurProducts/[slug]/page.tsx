
// import React from "react";
// import { client } from "@/sanity/lib/client";
// import { Product } from "../../../../types/products";
// import Image from "next/image";
// import { groq } from "next-sanity";
// import { urlFor } from "@/sanity/lib/image";
// import TopProduct from "../../../Components/TopProducts/page";



// interface OurProductPageProp {
//   params: Promise<{ slug: string }>;
// }

// async function getProduct(slug: string): Promise<Product> {
//   return client.fetch(
//     groq`*[_type == "Products" && slug.current == $slug][0]{
//         _id,
//         title,
//         type,
//         image,
//         price,

//         }`,
//     { slug }
//   );
// }

// export default async function productPage({ params }: OurProductPageProp) {
//   const { slug } = await params;
//   const product = await getProduct(slug);

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//         <div className="aspect-square">
//           {product.image && (
//             <Image
//               src={urlFor(product.image).url()}
//               alt={product.title}
//               width={500}
//               height={500}
//               className="rouneded-md shadow-md"
//             />
//           )}
//         </div>
//         <div className="flex flex-col gap-8">
//           <h1 className="text-4xl font-bold">{product.title}</h1>
//           <p className="text-2xl font-sans">{product.price}</p>
//         </div>
//         <TopProduct/>
//       </div>
      
//     </div>
//   );
// }


// src/app/OurProducts/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { Product } from "../../../../types/products";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

async function getProduct(slug: string): Promise<Product> {
  return client.fetch(
    `*[_type == "products" && slug.current == $slug][0]{
      _id,
      title,
      type,
      image,
      price,
      priceWithoutDiscount,
      badge,
      description,
      tags,
      category->{
        title,
        slug
      }
    }`,
    { slug }
  );
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  // Check if product exists
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square">
          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={product.title}
              width={500}
              height={500}
              className="rounded-md shadow-md"
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl font-sans">${product.price}</p>
          {product.priceWithoutDiscount && (
            <p className="text-lg text-red-600 line-through">
              ${product.priceWithoutDiscount}
            </p>
          )}
          {product.badge && (
            <p className="text-lg text-green-600">{product.badge}</p>
          )}
          <p className="text-lg">{product.description}</p>
          {product.category && (
            <p className="text-lg">Category: {product.category.title}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-slate-400 text-black px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



