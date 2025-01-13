interface CardProduct extends Product {
  loading?: "lazy" | "eager";
  className?: string;
}

function CardProduct(props: CardProduct) {
  const { id, title, price, discount, className } = props;

  const rating = parseFloat(String(props.rating)).toFixed(1);
  const previousPrice = discount
    ? (price / (1 - discount / 100)).toFixed(2)
    : null;

  return (
    <article aria-labelledby={`product-title-${title}`} className={className}>
      <figure>
        <img
          onError={(e) => (e.currentTarget.src = "/imgs/not-found.webp")}
          className="aspect-[99/100] w-[295px] rounded-[20px]"
          src={props.thumbnailUrl ?? "/imgs/not-found.webp"}
          loading={props.loading ?? "lazy"}
          alt={title}
        />
      </figure>

      <div className="flex flex-col gap-2 mt-4 text-black">
        <h3 className="font-bold text-xl">
          <a
            className="hover:underline"
            aria-label={`Go to ${title}`}
            href={`/product/${id}`}
          >
            {title}
          </a>
        </h3>

        <div className="inline-flex justify-start gap-1">
          {/* Estrellas de Calificación */}
          <span
            className={`text-xl -my-[6px] inline-flex rating-star rating-star-[${rating}]`}
            aria-label={`Calificación de ${rating} de 5`}
            role="img"
          ></span>
          <p className="text-sm">
            {rating}/<span className="opacity-60">5</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-3">
          {/* Precio Actual */}
          <data className="font-bold text-2xl" value="120">
            ${price ?? "$"}
          </data>

          {/* Precio Anterior con Descuento */}
          {discount && previousPrice && (
            <>
              <s className="font-bold text-2xl opacity-40">${previousPrice}</s>
              <span className="bg-[#FF333310] text-[#FF3333] rounded-full py-[6px] px-[14px]">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default CardProduct;
