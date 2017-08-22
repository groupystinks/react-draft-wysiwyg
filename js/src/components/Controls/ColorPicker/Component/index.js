/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { stopPropagation } from '../../../../Utils/common';
import Option from '../../../Option';
import styles from './styles.css'; // eslint-disable-line no-unused-vars
import { HuePicker } from 'react-color';

class LayoutComponent extends Component {

  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    currentState: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    currentStyle: 'color',
    pickColor: '#36c',
  };

  componentWillReceiveProps(props) {
    if (!this.props.expanded && props.expanded) {
      this.setState({
        currentStyle: 'color',
      });
    }
  }

  setCurrentStyleBgcolor: Function = (): void => {
    this.setState({
      currentStyle: 'bgcolor',
    });
  };

  setCurrentStyleColor: Function = (): void => {
    this.setState({
      currentStyle: 'color',
    });
  };

  onChange: Function = (color: string): void => {
    const { onChange, isTablePicker } = this.props;
    const { currentStyle } = this.state;
    if (isTablePicker) {
      this.props.onTablePickerChange(currentStyle, color)
    } else {
      onChange(currentStyle, color);
    }
  }

  pickerChangeHandler = (color: Object) => {
    this.setState({ pickColor: color.hex });
    this.onChange(color.hex)
  }

  renderModal: Function = (): Object => {
    const {
      config: { popupClassName, colors }, currentState: { color, bgColor }, translations,
    } = this.props;
    const { currentStyle } = this.state;
    const currentSelectedColor = (currentStyle === 'color') ? color : bgColor;
    return (
      <div
        className={classNames('rdw-colorpicker-modal', popupClassName)}
        onClick={stopPropagation}
      >
        <span className="rdw-colorpicker-modal-header">
          <span
            className={classNames(
              'rdw-colorpicker-modal-style-label',
              { 'rdw-colorpicker-modal-style-label-active': currentStyle === 'color' }
            )}
            onClick={this.setCurrentStyleColor}
          >
            {translations['components.controls.colorpicker.text']}
          </span>
          <span
            className={classNames(
              'rdw-colorpicker-modal-style-label',
              { 'rdw-colorpicker-modal-style-label-active': currentStyle === 'bgcolor' }
            )}
            onClick={this.setCurrentStyleBgcolor}
          >
            {translations['components.controls.colorpicker.background']}
          </span>
        </span>
        <span className="rdw-colorpicker-modal-options">
          {
            colors.map((color, index) =>
              <Option
                value={color}
                key={index}
                className="rdw-colorpicker-option"
                activeClassName="rdw-colorpicker-option-active"
                active={currentSelectedColor === color}
                onClick={this.onChange}
              >
                <span
                  style={{ backgroundColor: color }}
                  className="rdw-colorpicker-cube"
                />
              </Option>
            )
          }
        </span>
        <div
          style={{
            backgroundColor: this.state.pickColor,
            height: '35px',
          }}
        />
        <HuePicker
          color={this.state.pickColor}
          onChangeComplete={this.pickerChangeHandler}
          style={{ wrap: {width: '100%'} }}
        />
      </div>
    );
  };

  render(): Object {
    const { config: { icon, className }, expanded, onExpandEvent } = this.props;
    return (
      <div
        className="rdw-colorpicker-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
      >
        <Option
          onClick={onExpandEvent}
          className={classNames(className)}
        >
          <i
            className={icon}
          />
        </Option>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
