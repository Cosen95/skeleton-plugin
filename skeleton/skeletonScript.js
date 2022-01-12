window.Skeleton = (function () {
  const $$ = document.querySelectorAll.bind(document);
  const CLASS_NAME_PREFIX = "sk-";
  const REMOVE_TAGS = ["title", "meta"];
  // 缓存
  const styleCache = new Map();

  function buttonHandler(element, options = {}) {
    const className = `${CLASS_NAME_PREFIX}button`;
    const rule = `{
      color: ${options.color}!important;
      background: ${options.color}!important;
      border: none!important;
      box-shadow: none!important;
    }`;
    addStyle(`.${className}`, rule);
    element.classList.add(className);
  }
  function imageHandler(element, options = {}) {
    // 最小 1 * 1 像素的透明 gif 图片
    const SMALLEST_BASE64 =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const { width, height } = element.getBoundingClientRect();
    const attrs = {
      width,
      height,
      src: SMALLEST_BASE64,
    };
    setAttributes(element, attrs);
    const className = `${CLASS_NAME_PREFIX}image`;
    const rule = `{
      background: ${options.color}!important;
    }`;
    addStyle(`.${className}`, rule);
    element.classList.add(className);
  }

  function setAttributes(element, attrs) {
    Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key]));
  }

  function addStyle(selector, rule) {
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule);
    }
  }
  // 转换原始元素为骨架屏DOM元素
  function genSkeleton(options) {
    let rootElement = document.documentElement;
    (function traverse(options) {
      let { button, image } = options;
      const buttons = [];
      const images = [];
      (function preTraverse(element) {
        if (element.children && element.children.length) {
          Array.from(element.children).forEach((child) => preTraverse(child));
        }
        if (element.tagName === "BUTTON") {
          buttons.push(element);
        } else if (element.tagName === "IMG") {
          images.push(element);
        }
      })(rootElement);
      buttons.forEach((item) => buttonHandler(item, button));
      images.forEach((item) => imageHandler(item, image));
    })(options);
    let rules = "";
    for (const [selector, rule] of styleCache) {
      rules += `${selector} ${rule}\n`;
    }
    const styleElement = document.createElement("style");
    styleElement.innerHTML = rules;
    document.head.appendChild(styleElement);
  }
  // 获得骨架DOM元素的HTML字符串和样式style
  function getHtmlAndStyle() {
    const styles = Array.from($$("style")).map(
      (style) => style.innerHTML || style.innerText
    );
    Array.from($$(REMOVE_TAGS.join(","))).forEach((element) =>
      element.parentNode.removeChild(element)
    );
    const html = document.body.innerHTML;
    return { html, styles };
  }
  return { genSkeleton, getHtmlAndStyle };
})();
