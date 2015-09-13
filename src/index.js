import { is } from 'ramda';
import { prependClass, functor } from './utils';

const defaultOptions = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: {left: 0, top: 0}
};

export default function tooltip(d3, className = 'tooltip', {
  left,
  top,
  offset,
  } = defaultOptions) {
  let attrs = {'class': className};
  let text = () => '';
  let styles = {};

  let el;
  const body = d3.select('body');
  const bodyNode = body.node();

  function tip(selection) {
    selection.on({
      'mouseover.tip': node => {
        let [mouseX, mouseY] = d3.mouse(bodyNode);
        let [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

        body.selectAll('div.tip').remove();

        el = body.append('div')
          .attr(prependClass(className)(attrs))
          .style({
            position: 'absolute',
            'z-index': 1001,
            left: x + 'px',
            top: y + 'px',
            ...styles
          })
          .html(() => text(node));
      },

      'mousemove.tip': node => {
        let [mouseX, mouseY] = d3.mouse(bodyNode);
        let [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

        el
          .style({
            left: x + 'px',
            top: y + 'px'
          })
          .html(() => text(node));
      },

      'mouseout.tip': () => el.remove()
    });
  }

  tip.attr = function setAttr(d) {
    if (is(Object, d)) {
      attrs = {...attrs, ...d};
    }
    return this;
  };

  tip.style = function setStyle(d) {
    if (is(Object, d)) {
      styles = {...styles, ...d};
    }
    return this;
  };

  tip.text = function setText(d) {
    text = functor(d);
    return this;
  };

  return tip;
}
