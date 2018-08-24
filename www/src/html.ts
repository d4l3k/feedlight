export const html = (body: typeof import("*.html")) => {
  const template = document.createElement('template')
  template.innerHTML = body + ''
  return template
}
