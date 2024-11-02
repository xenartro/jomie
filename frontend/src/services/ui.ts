export function resetScrollPosition() {
  window.scrollTo(0, 0);
}

export function setEditingSectionClass(section: string, status?: boolean) {
  const sections = ["basics", "links", "posts", "palette", "font", "layout"];
  document.body.classList.remove("--enabled");
  document.body.classList.remove("--disabled");
  sections.forEach((section) => {
    document.body.classList.remove(section);
  });
  if (section) {
    document.body.classList.add(section);
    if (status !== undefined) {
      document.body.classList.add(status ? "--enabled" : "--disabled");
    }
  }
}
