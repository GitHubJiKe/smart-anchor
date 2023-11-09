import SmartAnchor from './SmartAnchor'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
 <h1>Smart Anchor</h1>
<div class="demo1">
<ul>
<ol id="a">A</ol>
<ol id="b">B</ol>
<ol id="c">C</ol>
<ol id="d">D</ol>
</ul>
<div class="sa-container">
<div class="a" >
<p anchor="a">A</p>
</div>
<div class="b" >
<p anchor="b">B</p>
</div>
<div class="c"><p anchor="c">C</p></div>
<div class="d"><p anchor="d">D</p></div>
</div>
</div>
<div class="demo2">
<ul class="nav">
<ol id="a2">A</ol>
<ol id="b2">B</ol>
<ol id="c2">C</ol>
<ol id="d2">D</ol>
</ul>
<div class="sa-container2">
<div class="a2" >
<label anchor="a2">A</label>
</div>
<div class="b2" >
<label anchor="b2">B</label>
</div>
<div class="c2" ><label anchor="c2">C</label></div>
<div class="d2" ><label anchor="d2">D</label></div>
</div>
</div>
`
const ids = ['a', 'b', 'c', 'd']
new SmartAnchor({
  anchorIds: ids,
  container: '.sa-container',
  direction: 'v',
  offsetTopDiff: 10, // 滚动距离容器顶部的距离
  intersectionObserverOptions: {
    rootMargin: '0px',
    threshold: 0.3, // 露出交叉 30% 就算命中
  },
  onCointainerScroll: (activeId) => {
    ids.forEach(id => {
      const anchor = document.getElementById(id)
      if (id === activeId) {
        anchor?.classList.add('highlight')
      } else {
        anchor?.classList.remove('highlight')
      }
    })
  }
})
const ids2 = ['a2', 'b2', 'c2', 'd2']
new SmartAnchor({
  direction: 'h',
  anchorIds: ids2,
  container: '.sa-container2',
  offsetLeftDiff: 100, // 滚动距离容器顶部的距离
  intersectionObserverOptions: {
    rootMargin: '0px',
    threshold: 1, // 露出交叉 30% 就算命中
  },
  onCointainerScroll: (activeId) => {
    ids2.forEach(id => {
      const anchor = document.getElementById(id)
      if (id === activeId) {
        anchor?.classList.add('highlight')
      } else {
        anchor?.classList.remove('highlight')
      }
    })
  }
})
