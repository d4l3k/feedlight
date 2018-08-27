export const html = (body: typeof import("*.html") | string): HTMLTemplateElement => {
  const template = document.createElement('template')
  template.innerHTML = body + ''
  return template
}
