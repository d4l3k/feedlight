export const html = (body: typeof import("*.html")): HTMLTemplateElement => {
  const template = document.createElement('template')
  template.innerHTML = body + ''
  return template
}
