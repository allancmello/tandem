import React from 'react';
import cx from 'classnames';

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

class CaretComponent extends React.Component {
  componentDidMount() {

  }
  render() {

    var caret = this.props.caret;
    var cell = caret.getCell();

    var tr     = this.props.editor.textRuler;
    var line   = this.props.editor.lines[cell.row];

    var [x] = tr.calculateCharacterSize(line.toString().substr(0, cell.column));
    var h = line.getHeight();
    var y = h * cell.row;

    var classNames = cx({
      'm-text-editor--caret': true,
      'blink': this.props.idle
    });

    var style = {

      // offset cursor width
      'transform': 'translate('+ Math.max(0, x - 1) + 'px, ' + y + 'px)',
      'height'   : line.getHeight()
    };

    return <div className={ classNames } style={style}>

    </div>;
  }
}

export default CaretComponent;