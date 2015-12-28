import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';

class StyleDeclarationComponent extends React.Component {
  removeDeclaration() {
    this.props.reference.setValue(void 0);
  }
  render() {

    var entity   = this.props.entity;
    var plugin   = this.props.plugin;

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{this.props.reference.property}</span> <span className='m-styles-pane--declaration-value'>{
        plugin.factory.create({
          app       : this.props.app,
          entity    : entity,
          reference : this.props.reference
        })
      }</span>
    <span className='declaration-remove' onClick={this.removeDeclaration.bind(this)}>
        <i className='ion-close-circled'></i>
      </span>
    </div>;
  }
}

class EntityStylesPaneComponent extends React.Component {

  render() {

    var entity = this.props.entity;
    var plugin = this.props.plugin;

    var styles = entity.getStyle();

    var rows = [];

    for (var styleName in styles) {

      var stylePlugin = this.props.app.plugins.queryOne({
        componentType : 'styleInput',
        styleName     : styleName
      });

      if (!stylePlugin || stylePlugin.styleType !== plugin.styleType) {
        continue;
      }

      rows.push(<StyleDeclarationComponent
        plugin={stylePlugin}
        app={this.props.app}
        entity={entity}
        reference={StyleReference.create(entity, styleName)}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return app.plugins.indexOf(a.props.plugin) > app.plugins.indexOf(b.props.plugin) ? 1 : -1;
    });

    return <div className='m-styles-pane'>
      { rows }
    </div>;
  }
}

export default EntityStylesPaneComponent;
