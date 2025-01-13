import { useEffect, useState } from "react";
import CardProduct from "./CardProduct";
import Paginator from "./Paginator";

function FetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [curPage, setCurPage] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const handlePageChange = (currentPage: number) => {
    setCurPage(currentPage);
  };

  const fetchProducts = async (page: number) => {
    const response = await fetch(`/api/products?page=${page}&size=12`);
    const data = await response.json();
    !totalPages && setTotalPages(data.totalPages);
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts(curPage!);
  }, [curPage]);

  useEffect(() => {
    if (curPage === undefined) {
      setCurPage(1);
    }
  }, []);

  useEffect(() => {
    console.log("Total Pages: ", totalPages);
  }, [totalPages]);

  return (
    <>
      <section className="col-span-2 row-span-3 row-start-2">
        {/* HEADER */}
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-2xl">Casual</h3>
          <div className="inline-flex gap-x-3 text-primary">
            <p>Showing 1-10 of 100 Products</p>
            <div className="">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                name="sort"
                defaultValue={"price"}
                className="bg-transparent font-medium text-black text-center"
              >
                <option value="newest">Newest</option>
                <option value="price">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(295px,1fr))]">
          {/* PRODUCT CARDS */}
          {products.map((product) => (
            <CardProduct
              className="mt-4 w-fit mx-auto"
              id={product.id}
              key={product.id}
              title={product.title}
              price={product.price}
              discount={product.discount}
              thumbnailUrl={product.thumbnailUrl}
              rating={product.rating}
              timestamp={new Date()}
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <Paginator
        currentPage={curPage!}
        totalPages={totalPages!}
        onPageChange={handlePageChange}
        // maxVisiblePages={5}
      />
    </>
  );
}

export default FetchProducts;
