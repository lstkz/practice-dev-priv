interface ProductHuntProps {
  className?: string;
}

export function ProductHunt(props: ProductHuntProps) {
  return (
    <a
      href="https://www.producthunt.com/posts/practice-dev?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-practice-dev"
      target="_blank"
      {...props}
      tw="lg:absolute -top-0 block"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=218867&theme=light"
        alt="Practice.dev - Practice programming for free | Product Hunt"
        style={{
          width: 250,
          height: 54,
        }}
        width="250"
        height="54"
      />
    </a>
  );
}
