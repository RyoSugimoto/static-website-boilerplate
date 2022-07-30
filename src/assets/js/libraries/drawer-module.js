import 'wicg-inert';

const styleForFixed = {
  height: '100vh',
  left: '0',
  overflow: 'hidden',
  position: 'fixed',
  width: '100vw'
};

const scrollingElement = (() => {
  const ua = window.navigator.userAgent.toLowerCase();
  if ('scrollingElement' in document) return document.scrollingElement;
  if (ua.indexOf('webkit') > 0) return document.body;
  return document.documentElement;
})();

function fixBackface(fixed) {
  const scrollY = fixed ? scrollingElement.scrollTop : parseInt(document.body.style.top) ?? 0;
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.body.style.top = fixed ? `-${scrollingElement.scrollTop}px` : '';
  document.body.style.paddingRight = fixed ? `${scrollbarWidth}px` : '';
  Object.keys(styleForFixed).forEach(key => {
    if (fixed) {
      document.body.style.setProperty(key, styleForFixed[key]);
    } else {
      document.body.style.removeProperty(key);
    }
  });
  if (!fixed) scrollingElement.scrollTop = scrollY * -1;
}

class Drawer {
  constructor(args) {
    this.isExpanded = false;
    this.enableFixBackface = true;
    this.enableHistory = false;
    this.id = 'Drawer-' + new Date().getTime(); // Drawer body

    if (typeof args !== 'object' || args.drawer === undefined) throw new Error(`${this.constructor.name}: The "drawer" parameter is required. => ex: new Drawer({ drawer: '#drawer' })`);
    if (typeof args.drawer !== 'string' || '') throw new Error(`${this.constructor.name}: The "drawer" parameter must be "string" type and "CSS selector".`);
    if (args.drawer === '') throw new Error(`${this.constructor.name}: The "drawer" parameter is empty.`);
    this.drawerElement = document.querySelector(args.drawer);
    if (!this.drawerElement) throw new Error(`${this.constructor.name}: The Element for "drawer" is not found.`);
    this.drawerElement.setAttribute('data-drawer-is-initialized', 'true');

    if (this.drawerElement.id) {
      this.id = this.drawerElement.id;
    } else {
      this.drawerElement.id = this.id;
    }

    if (this.isExpanded) {
      this.drawerElement.removeAttribute('inert');
      this.drawerElement.removeAttribute('hidden');
    } else {
      this.drawerElement.setAttribute('inert', '');
      this.drawerElement.setAttribute('hidden', '');
    } // Switches for toggle


    this.switchElements = typeof args.switch === 'string' ? document.querySelectorAll(args.switch) : null;

    if (this.switchElements) {
      this.switchElements.forEach(element => {
        element.addEventListener('click', this.toggle.bind(this));
        element.setAttribute('data-drawer-is-initialized', 'true');
        element.setAttribute('aria-controls', this.id);
      });
    } // Elements that are set "inert" attribute when the drawer is expanded


    this.inertElements = typeof args.inert === 'string' ? document.querySelectorAll(args.inert) : null;

    if (this.inertElements) {
      this.inertElements.forEach(element => {
        element.setAttribute('data-drawer-is', 'initialized');

        if (this.isExpanded) {
          element.setAttribute('inert', '');
        } else {
          element.removeAttribute('inert');
        }
      });
    } // Preventing scroll when the drawer is expanded


    this.enableFixBackface = args.enableFixBackface ?? true; // Adding the state of the drawer to the history of your browser

    if (args.enableHistory) {
      this.enableHistory = true;
      window.addEventListener('popstate', this._popstateHandler.bind(this));
    }
  }

  toggle(event) {
    event.preventDefault();

    if (this.isExpanded) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this._changeState(true);

    if (this.enableHistory) this._pushState(true);
  }

  close() {
    this._changeState(false);

    if (this.enableHistory) this._pushState(false);
  }

  _changeState(isExpanded) {
    if (isExpanded) {
      var _this$drawerElement, _this$drawerElement2;

      (_this$drawerElement = this.drawerElement) === null || _this$drawerElement === void 0 ? void 0 : _this$drawerElement.removeAttribute('inert');
      (_this$drawerElement2 = this.drawerElement) === null || _this$drawerElement2 === void 0 ? void 0 : _this$drawerElement2.removeAttribute('hidden');
      document.addEventListener('keyup', this._keyupHandler.bind(this));
    } else {
      var _this$drawerElement3, _this$drawerElement4;

      // When the drawer is hidden
      (_this$drawerElement3 = this.drawerElement) === null || _this$drawerElement3 === void 0 ? void 0 : _this$drawerElement3.setAttribute('inert', '');
      (_this$drawerElement4 = this.drawerElement) === null || _this$drawerElement4 === void 0 ? void 0 : _this$drawerElement4.setAttribute('hidden', '');
      document.removeEventListener('keyup', this._keyupHandler.bind(this));
    }

    if (typeof fixBackface === 'function' && this.enableFixBackface) fixBackface(isExpanded);

    if (this.switchElements) {
      this.switchElements.forEach(element => {
        element.setAttribute('aria-expanded', String(isExpanded));
      });
    }

    if (this.inertElements) {
      this.inertElements.forEach(element => {
        if (isExpanded) {
          element.setAttribute('inert', '');
        } else {
          element.removeAttribute('inert');
        }
      });
    }

    this.isExpanded = isExpanded;
  }

  _keyupHandler(event) {
    if (event.key === 'Escape' || event.key === 'Esc') this.close();
  }

  _popstateHandler(event) {
    this._changeState(!this.isExpanded);
  }

  _pushState(isExpanded) {
    history.pushState({
      isExpanded: isExpanded
    }, 'drawerState');
  }

}

export default Drawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLW1vZHVsZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3RzL2ZpeC1iYWNrZmFjZS50cyIsIi4uL3NyYy90cy9kcmF3ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3R5bGVGb3JGaXhlZDoge1xuICBba2V5OiBzdHJpbmddOiBzdHJpbmdcbn0gPSB7XG4gIGhlaWdodDogJzEwMHZoJyxcbiAgbGVmdDogJzAnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHBvc2l0aW9uOiAnZml4ZWQnLFxuICB3aWR0aDogJzEwMHZ3Jyxcbn1cblxuY29uc3Qgc2Nyb2xsaW5nRWxlbWVudDogRWxlbWVudCA9ICgoKSA9PiB7XG4gIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKVxuICBpZiAoJ3Njcm9sbGluZ0VsZW1lbnQnIGluIGRvY3VtZW50KSByZXR1cm4gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCFcbiAgaWYgKHVhLmluZGV4T2YoJ3dlYmtpdCcpID4gMCkgcmV0dXJuIGRvY3VtZW50LmJvZHkhXG4gIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhXG59KSgpIVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaXhCYWNrZmFjZShmaXhlZDogYm9vbGVhbikge1xuICBjb25zdCBzY3JvbGxZOm51bWJlciA9IGZpeGVkID8gc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3AgOiBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCkgPz8gMFxuICBjb25zdCBzY3JvbGxiYXJXaWR0aDpudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGhcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBmaXhlZCA/IGAtJHtzY3JvbGxpbmdFbGVtZW50LnNjcm9sbFRvcH1weGAgOiAnJ1xuICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IGZpeGVkID8gYCR7c2Nyb2xsYmFyV2lkdGh9cHhgIDogJydcbiAgT2JqZWN0LmtleXMoc3R5bGVGb3JGaXhlZCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChmaXhlZCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHN0eWxlRm9yRml4ZWRba2V5XSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpXG4gICAgfVxuICB9KVxuICBpZiAoIWZpeGVkKSBzY3JvbGxpbmdFbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbFkgKiAtMVxufVxuIiwiaW1wb3J0IGZpeEJhY2tmYWNlIGZyb20gJy4vZml4LWJhY2tmYWNlLmpzJ1xuaW1wb3J0ICd3aWNnLWluZXJ0JztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdlciB7XG4gIHB1YmxpYyBkcmF3ZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGxcbiAgcHVibGljIHN3aXRjaEVsZW1lbnRzPzogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gfCBudWxsXG4gIHB1YmxpYyBpbmVydEVsZW1lbnRzPzogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gfCBudWxsXG4gIHB1YmxpYyBpc0V4cGFuZGVkOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGVuYWJsZUZpeEJhY2tmYWNlOmJvb2xlYW4gPSB0cnVlXG4gIHB1YmxpYyBlbmFibGVIaXN0b3J5OiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGlkOiBzdHJpbmcgPSAnRHJhd2VyLScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IHtcbiAgICBkcmF3ZXI6IHN0cmluZ1xuICAgIHN3aXRjaD86IHN0cmluZ1xuICAgIGluZXJ0Pzogc3RyaW5nXG4gICAgZW5hYmxlRml4QmFja2ZhY2U/OiBib29sZWFuXG4gICAgZW5hYmxlSGlzdG9yeT86IGJvb2xlYW5cbiAgfSkge1xuICAgIC8vIERyYXdlciBib2R5XG4gICAgaWYgKHR5cGVvZiBhcmdzICE9PSAnb2JqZWN0JyB8fCBhcmdzLmRyYXdlciA9PT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfTogVGhlIFwiZHJhd2VyXCIgcGFyYW1ldGVyIGlzIHJlcXVpcmVkLiA9PiBleDogbmV3IERyYXdlcih7IGRyYXdlcjogJyNkcmF3ZXInIH0pYClcbiAgICBpZiAodHlwZW9mIGFyZ3MuZHJhd2VyICE9PSAnc3RyaW5nJyB8fCAnJyApIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiBUaGUgXCJkcmF3ZXJcIiBwYXJhbWV0ZXIgbXVzdCBiZSBcInN0cmluZ1wiIHR5cGUgYW5kIFwiQ1NTIHNlbGVjdG9yXCIuYClcbiAgICBpZiAoYXJncy5kcmF3ZXIgPT09ICcnICkgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06IFRoZSBcImRyYXdlclwiIHBhcmFtZXRlciBpcyBlbXB0eS5gKVxuICAgIHRoaXMuZHJhd2VyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJncy5kcmF3ZXIpXG4gICAgaWYgKCF0aGlzLmRyYXdlckVsZW1lbnQpIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9OiBUaGUgRWxlbWVudCBmb3IgXCJkcmF3ZXJcIiBpcyBub3QgZm91bmQuYClcbiAgICB0aGlzLmRyYXdlckVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWRyYXdlci1pcy1pbml0aWFsaXplZCcsICd0cnVlJylcbiAgICBpZiAodGhpcy5kcmF3ZXJFbGVtZW50LmlkKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5kcmF3ZXJFbGVtZW50LmlkXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd2VyRWxlbWVudC5pZCA9IHRoaXMuaWRcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xuICAgICAgdGhpcy5kcmF3ZXJFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaW5lcnQnKVxuICAgICAgdGhpcy5kcmF3ZXJFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3ZXJFbGVtZW50LnNldEF0dHJpYnV0ZSgnaW5lcnQnLCAnJylcbiAgICAgIHRoaXMuZHJhd2VyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICcnKVxuICAgIH1cblxuICAgIC8vIFN3aXRjaGVzIGZvciB0b2dnbGVcbiAgICB0aGlzLnN3aXRjaEVsZW1lbnRzID0gdHlwZW9mIGFyZ3Muc3dpdGNoID09PSAnc3RyaW5nJyA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3Muc3dpdGNoKSA6IG51bGxcbiAgICBpZiAodGhpcy5zd2l0Y2hFbGVtZW50cykge1xuICAgICAgdGhpcy5zd2l0Y2hFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy50b2dnbGUuYmluZCh0aGlzKSlcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZHJhd2VyLWlzLWluaXRpYWxpemVkJywgJ3RydWUnKVxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRoaXMuaWQpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIEVsZW1lbnRzIHRoYXQgYXJlIHNldCBcImluZXJ0XCIgYXR0cmlidXRlIHdoZW4gdGhlIGRyYXdlciBpcyBleHBhbmRlZFxuICAgIHRoaXMuaW5lcnRFbGVtZW50cyA9IHR5cGVvZiBhcmdzLmluZXJ0ID09PSAnc3RyaW5nJyA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3MuaW5lcnQpIDogbnVsbFxuICAgIGlmICh0aGlzLmluZXJ0RWxlbWVudHMpIHtcbiAgICAgIHRoaXMuaW5lcnRFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1kcmF3ZXItaXMnLCAnaW5pdGlhbGl6ZWQnKVxuICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2luZXJ0JywgJycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2luZXJ0JylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50aW5nIHNjcm9sbCB3aGVuIHRoZSBkcmF3ZXIgaXMgZXhwYW5kZWRcbiAgICB0aGlzLmVuYWJsZUZpeEJhY2tmYWNlID0gYXJncy5lbmFibGVGaXhCYWNrZmFjZSA/PyB0cnVlXG5cbiAgICAvLyBBZGRpbmcgdGhlIHN0YXRlIG9mIHRoZSBkcmF3ZXIgdG8gdGhlIGhpc3Rvcnkgb2YgeW91ciBicm93c2VyXG4gICAgaWYgKGFyZ3MuZW5hYmxlSGlzdG9yeSkge1xuICAgICAgdGhpcy5lbmFibGVIaXN0b3J5ID0gdHJ1ZVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5fcG9wc3RhdGVIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgfVxuXG4gIH1cbiAgdG9nZ2xlKGV2ZW50OiBFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKClcbiAgICB9XG4gIH1cbiAgb3BlbigpIHtcbiAgICB0aGlzLl9jaGFuZ2VTdGF0ZSh0cnVlKVxuICAgIGlmICh0aGlzLmVuYWJsZUhpc3RvcnkpIHRoaXMuX3B1c2hTdGF0ZSh0cnVlKVxuICB9XG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX2NoYW5nZVN0YXRlKGZhbHNlKVxuICAgIGlmICh0aGlzLmVuYWJsZUhpc3RvcnkpIHRoaXMuX3B1c2hTdGF0ZShmYWxzZSlcbiAgfVxuICBwcml2YXRlIF9jaGFuZ2VTdGF0ZShpc0V4cGFuZGVkOiBib29sZWFuKSB7XG4gICAgaWYgKGlzRXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuZHJhd2VyRWxlbWVudD8ucmVtb3ZlQXR0cmlidXRlKCdpbmVydCcpXG4gICAgICB0aGlzLmRyYXdlckVsZW1lbnQ/LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5dXBIYW5kbGVyLmJpbmQodGhpcykpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2hlbiB0aGUgZHJhd2VyIGlzIGhpZGRlblxuICAgICAgdGhpcy5kcmF3ZXJFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2luZXJ0JywgJycpXG4gICAgICB0aGlzLmRyYXdlckVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJycpXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleXVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGZpeEJhY2tmYWNlID09PSAnZnVuY3Rpb24nICYmIHRoaXMuZW5hYmxlRml4QmFja2ZhY2UgKSBmaXhCYWNrZmFjZShpc0V4cGFuZGVkKVxuXG4gICAgaWYgKHRoaXMuc3dpdGNoRWxlbWVudHMpIHtcbiAgICAgIHRoaXMuc3dpdGNoRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBTdHJpbmcoaXNFeHBhbmRlZCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmluZXJ0RWxlbWVudHMpIHtcbiAgICAgIHRoaXMuaW5lcnRFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoaXNFeHBhbmRlZCkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpbmVydCcsICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdpbmVydCcpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5pc0V4cGFuZGVkID0gaXNFeHBhbmRlZFxuICB9XG4gIHByaXZhdGUgX2tleXVwSGFuZGxlcihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnIHx8IGV2ZW50LmtleSA9PT0gJ0VzYycpIHRoaXMuY2xvc2UoKVxuICB9XG4gIHByaXZhdGUgX3BvcHN0YXRlSGFuZGxlcihldmVudDogUG9wU3RhdGVFdmVudCkge1xuICAgIHRoaXMuX2NoYW5nZVN0YXRlKCF0aGlzLmlzRXhwYW5kZWQpO1xuICB9XG4gIHByaXZhdGUgX3B1c2hTdGF0ZShpc0V4cGFuZGVkOiBib29sZWFuKSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoe1xuICAgICAgaXNFeHBhbmRlZDogaXNFeHBhbmRlZFxuICAgIH0sICdkcmF3ZXJTdGF0ZScpXG4gIH1cbn0iXSwibmFtZXMiOlsic3R5bGVGb3JGaXhlZCIsImhlaWdodCIsImxlZnQiLCJvdmVyZmxvdyIsInBvc2l0aW9uIiwid2lkdGgiLCJzY3JvbGxpbmdFbGVtZW50IiwidWEiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImRvY3VtZW50IiwiaW5kZXhPZiIsImJvZHkiLCJkb2N1bWVudEVsZW1lbnQiLCJmaXhCYWNrZmFjZSIsImZpeGVkIiwic2Nyb2xsWSIsInNjcm9sbFRvcCIsInBhcnNlSW50Iiwic3R5bGUiLCJ0b3AiLCJzY3JvbGxiYXJXaWR0aCIsImlubmVyV2lkdGgiLCJjbGllbnRXaWR0aCIsInBhZGRpbmdSaWdodCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5Iiwic2V0UHJvcGVydHkiLCJyZW1vdmVQcm9wZXJ0eSIsIkRyYXdlciIsImNvbnN0cnVjdG9yIiwiYXJncyIsIkRhdGUiLCJnZXRUaW1lIiwiZHJhd2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYW1lIiwiZHJhd2VyRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJzZXRBdHRyaWJ1dGUiLCJpZCIsImlzRXhwYW5kZWQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzd2l0Y2hFbGVtZW50cyIsInN3aXRjaCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZSIsImJpbmQiLCJpbmVydEVsZW1lbnRzIiwiaW5lcnQiLCJlbmFibGVGaXhCYWNrZmFjZSIsImVuYWJsZUhpc3RvcnkiLCJfcG9wc3RhdGVIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImNsb3NlIiwib3BlbiIsIl9jaGFuZ2VTdGF0ZSIsIl9wdXNoU3RhdGUiLCJfa2V5dXBIYW5kbGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIlN0cmluZyIsImhpc3RvcnkiLCJwdXNoU3RhdGUiXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTUEsYUFBYSxHQUVmO0FBQ0ZDLEVBQUFBLE1BQU0sRUFBRSxPQUROO0FBRUZDLEVBQUFBLElBQUksRUFBRSxHQUZKO0FBR0ZDLEVBQUFBLFFBQVEsRUFBRSxRQUhSO0FBSUZDLEVBQUFBLFFBQVEsRUFBRSxPQUpSO0FBS0ZDLEVBQUFBLEtBQUssRUFBRTtBQUxMLENBRko7O0FBVUEsTUFBTUMsZ0JBQWdCLEdBQVksQ0FBQztBQUNqQyxRQUFNQyxFQUFFLEdBQUdDLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsU0FBakIsQ0FBMkJDLFdBQTNCLEVBQVg7QUFDQSxNQUFJLHNCQUFzQkMsUUFBMUIsRUFBb0MsT0FBT0EsUUFBUSxDQUFDTixnQkFBaEI7QUFDcEMsTUFBSUMsRUFBRSxDQUFDTSxPQUFILENBQVcsUUFBWCxJQUF1QixDQUEzQixFQUE4QixPQUFPRCxRQUFRLENBQUNFLElBQWhCO0FBQzlCLFNBQU9G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
