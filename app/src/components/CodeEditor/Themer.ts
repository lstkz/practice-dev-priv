interface TokenStyle {
  foreground: string;
  fontStyle: string;
}

interface TokenColor {
  scope: string | string[];
  settings: TokenStyle;
}

interface ThemeSettings {
  tokenColors: TokenColor[];
}

const DEBUG = false;

export class Themer {
  private settings: ThemeSettings = null!;
  private map: Map<string, { style: TokenStyle; className: string }> = null!;
  private scopeCache: Map<string, string> = null!;

  loadTheme(settings: ThemeSettings) {
    this.settings = settings;
    this.map = new Map();
    this.scopeCache = new Map();
    for (const token of settings.tokenColors) {
      if (!token.scope) {
        continue;
      }
      const scopes = Array.isArray(token.scope)
        ? token.scope
        : token.scope.split(',');
      for (const scope of scopes) {
        this.map.set(scope.trim(), {
          style: token.settings,
          className: this.getClassName(token.settings),
        });
      }
    }
  }

  private getClassName(style: TokenStyle) {
    const parts: string[] = [];
    if (style.fontStyle) {
      parts.push('style_' + style.fontStyle.toLowerCase());
    }
    if (style.foreground) {
      parts.push('color_' + style.foreground.substr(1).toLowerCase());
    }
    return parts.join('-');
  }

  private generateCSS(style: TokenStyle) {
    const entries: string[] = [];
    if (style.fontStyle) {
      entries.push(`font-style: ${style.fontStyle}`);
    }
    if (style.foreground) {
      entries.push(`color: ${style.foreground}`);
    }
    return entries.map(str => `  ${str} !important;`).join('\n');
  }

  generateStyles() {
    const handled = new Set<string>();
    let out = '';
    for (const { className, style } of this.map.values()) {
      if (handled.has(className)) {
        continue;
      }
      handled.add(className);
      out += `.${className} {
${this.generateCSS(style)}
}\n`;
    }
    return out;
  }

  injectStyles() {
    const node = document.createElement('style');
    node.setAttribute('type', 'text/css');
    node.setAttribute('media', 'screen');
    node.appendChild(document.createTextNode(this.generateStyles()));
    document.head.appendChild(node);
  }

  getClassNameForScope(scope: string) {
    if (this.scopeCache.has(scope)) {
      return this.scopeCache.get(scope)!;
    }
    let current = '';
    let ret = '';
    for (const part of scope.split('.')) {
      if (current) {
        current += '.';
      }
      current += part;
      const value = this.map.get(current);
      if (value) {
        ret = value.className;
      }
    }
    if (DEBUG && !ret) {
      console.log('no class for ', scope);
    }
    this.scopeCache.set(scope, ret);
    return ret;
  }
}
