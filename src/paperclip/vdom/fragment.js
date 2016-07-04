import create from 'common/class/utils/create';

export default class FragmentVNode {

  constructor(childNodes) {
    this.childNodes = childNodes || [];
  }

  freeze(options) {
    var fragment = options.nodeFactory.createDocumentFragment();

    for (var child of this.childNodes) {
      fragment.appendChild(child.freeze(options));
    }

    return fragment;
  }

  static create(childNodes) {
    return childNodes.length === 1 ? childNodes[0] : new FragmentVNode(childNodes);
  };
}
