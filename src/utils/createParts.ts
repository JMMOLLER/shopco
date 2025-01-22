export interface Parts {
  text: string;
  href: string | undefined;
}

const createParts = (path: string) => {
  const slugs: string[] = path.split("/").filter((x: string) => x);
  let currentPath = "";

  const parts: Parts[] = [
    {
      text: "Home",
      href: path !== "/" ? "/" : undefined
    }
  ];

  slugs.forEach((slug) => {
    const text: string = slug.replace(/[-_]/g, " ");
    currentPath = `${currentPath}/${slug}`;
    const href = currentPath;

    parts.push({
      text,
      href
    });
  });
  return parts;
};

export default createParts;