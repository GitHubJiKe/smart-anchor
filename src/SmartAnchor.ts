interface SmartAnchorOptions {
  direction: 'h' | 'v';
  anchorIds: string[];
  container?: string | HTMLElement | undefined | null;
  offsetTopDiff?: number;
  offsetLeftDiff?: number;
  onCointainerScroll?: (activeId: string) => void;
  intersectionObserverOptions?: { rootMargin?: string, threshold?: number | number[] }
}

const defaultOptions: SmartAnchorOptions = {
  anchorIds: [],
  container: document.body,
  offsetTopDiff: 0,
  offsetLeftDiff: 0,
  intersectionObserverOptions: {
    rootMargin: '0px',
    threshold: 1
  },
  direction: 'v'
}

export default class SmartAnchor {
  private opts: SmartAnchorOptions = defaultOptions;
  constructor(options: SmartAnchorOptions) {
    this.opts = options

    this.initAnchors()
  }

  private container: HTMLElement | undefined;
  private observer: IntersectionObserver | undefined;

  private idOrderMap: { [k: string]: number } = {}
  private initAnchors() {
    this.opts.anchorIds.forEach((id, idx) => {
      this.idOrderMap[id] = idx
      const anchor = document.getElementById(id)
      const aEle = this.genAndInsertInvisibleATag(id)
      anchor?.addEventListener('click', () => {
        aEle.click();
      })
    })


    this.container = (typeof this.opts.container === 'string' ? document.querySelector(this.opts.container) : this.opts.container) as HTMLElement;
    const containerPositionVal = window.getComputedStyle(this.container).getPropertyValue('position')
    if (!containerPositionVal || containerPositionVal === 'static') {
      this.container.style.position = 'relative'
    }
    this.observer = this.initIntersectionObserver()
    this.observeEles()
  }

  private observeEles() {
    this.opts.anchorIds.forEach(id => {
      const ele = this.container?.querySelector(`[anchor='${id}']`)! as HTMLElement;
      this.observer?.observe(ele)
    })
  }

  private initIntersectionObserver() {
    return new IntersectionObserver(this.handleIntersection.bind(this), {
      root: this.container,
      ...this.opts.intersectionObserverOptions
    })
  }

  private activeValues: string[] = []


  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const { target, isIntersecting } = entry;
      const val = target.getAttribute('anchor') as string
      if (isIntersecting) {
        this.activeValues.push(val)
      } else {
        const idx = this.activeValues.findIndex(v => v === val)
        if (idx > -1) {
          this.activeValues.splice(idx, 1)
        }
      }
      if (this.activeValues.length) {
        const sortedTarget = this.activeValues.map(v => {
          return {
            value: v,
            order: this.idOrderMap[v]
          }
        }).sort((v1, v2) => v1.order - v2.order)[0]
        if (this.opts.onCointainerScroll) {
          this.opts.onCointainerScroll(sortedTarget.value)
        }
      }

    })
  }

  private genAndInsertInvisibleATag(id: string) {
    const aEle = document.createElement('a');
    aEle.href = `#/${id}`
    aEle.style.display = 'none'
    aEle.style.textDecoration = 'none';
    aEle.id = `smart-anchor-invisible-a-tag-${id}`;
    aEle.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleInvisibleATagClick(id)
    })
    document.body.appendChild(aEle)
    return aEle
  }

  private handleInvisibleATagClick(id: string) {
    const targetEle = this.container?.querySelector(`[anchor='${id}']`)! as HTMLElement
    if (this.opts.direction === 'v') {
      this.container!.scrollTo({
        top: targetEle.offsetTop - ((this.opts.offsetTopDiff!) || 0),
        behavior: "smooth",
      });
    } else {
      this.container?.scrollTo({
        behavior: "smooth",
        left: targetEle.offsetLeft - ((this.opts.offsetLeftDiff!) || 0),
      })
    }
  }
}