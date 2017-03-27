'use strict';
import React, {Component, PropTypes} from 'react';

import {
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  Easing,
  Text,
  View,
  Platform
} from 'react-native';

var textPropTypes = Text.propTypes || View.propTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: View.propTypes.style,
}

var FloatingLabel  = React.createClass({
  propTypes: propTypes,

  getInitialState () {
    var state = {
      text: this.props.value,
      dirty: !!this.props.value
    };

    var style = state.dirty ? dirtyStyle : cleanStyle
    state.labelStyle = {
      fontSize: new Animated.Value(style.fontSize),
      top: new Animated.Value(style.top)
    }

    return state
  },
  
  componentWillReceiveProps (props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({ text: props.value, dirty: !!props.value })
      this._animate(!!props.value)
    }
  },

  _animate(dirty) {
    var nextStyle = dirty ? dirtyStyle : cleanStyle
    var labelStyle = this.state.labelStyle
    var anims = Object.keys(nextStyle).map(prop => {
      return Animated.timing(
        labelStyle[prop],
        {
          toValue: nextStyle[prop],
          duration: 200
        },
        Easing.ease
      )
    })

    Animated.parallel(anims).start()
  },

  _onFocus () {
    this._animate(true)
    this.setState({dirty: true})
    if (this.props.onFocus) {
      this.props.onFocus(arguments);
    }
  },

  _onBlur () {
    if (!this.state.text) {
      this._animate(false)
      this.setState({dirty: false});
    }

    if (this.props.onBlur) {
      this.props.onBlur(arguments);
    }
  },

  onChangeText(text) {
    this.setState({ text })
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  },

  updateText(event) {
    var text = event.nativeEvent.text
    this.setState({ text })

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event)
    }
  },

  _renderLabel () {
    return (
      <Animated.Text
        ref='label'
        numberOfLines={1}
        ellipsizeMode='tail'
        style={[this.state.labelStyle, styles.label, this.props.labelStyle]}
      >
        {this.props.children}
      </Animated.Text>
    )
  },

  render() {
    var props = {
        ref: this.props.reference,
        autoCapitalize: this.props.autoCapitalize,
        autoCorrect: this.props.autoCorrect,
        autoFocus: this.props.autoFocus,
        bufferDelay: this.props.bufferDelay,
        clearButtonMode: this.props.clearButtonMode,
        clearTextOnFocus: this.props.clearTextOnFocus,
        controlled: this.props.controlled,
        defaultValue: this.props.defaultValue,
        editable: this.props.editable,
        enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
        keyboardType: this.props.keyboardType,
        multiline: this.props.multiline,
        maxLength: this.props.maxLength,
        onBlur: this._onBlur,
        onChange: this.props.onChange,
        onChangeText: this.onChangeText,
        onEndEditing: this.updateText,
        onFocus: this._onFocus,
        onSelectionChange: this.props.onSelectionChange,
        onSubmitEditing: this.props.onSubmitEditing,
        returnKeyType: this.props.returnKeyType,
        secureTextEntry: this.props.secureTextEntry,
        selectTextOnFocus: this.props.selectTextOnFocus,
        selection: this.props.selection,
        selectionColor: this.props.selectionColor,
        selectionState: this.props.selectionState,
        style: [styles.input],
        testID: this.props.testID,
        value: this.props.value,
        numberOfLines: this.props.numberOfLines,
        returnKeyLabel: this.props.returnKeyLabel,
        dataDetectorTypes: this.props.dataDetectorTypes,
        keyboardAppearance: this.props.keyboardAppearance,
        onKeyPress: this.props.onKeyPress,
        underlineColorAndroid: this.props.underlineColorAndroid // android TextInput will show the default bottom border
      },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    return (
  		<View style={elementStyles}>
        {this._renderLabel()}
        <TextInput
          {...props}
        >
        </TextInput>
      </View>
    );
  },
});

var labelStyleObj = {
  marginTop: 21,
  paddingLeft: 5,
  color: '#AAA',
  position: 'absolute'
}

if (Platform.OS === 'web') {
  labelStyleObj.pointerEvents = 'none'
}

var styles = StyleSheet.create({
  element: {
    position: 'relative',
    borderBottomWidth: 1,
    borderColor: 'gray'
  },
  input: {
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: 'black',
    fontSize: 14,
    paddingLeft: 5,
    marginTop: 10,
  },
  label: labelStyleObj
})

var cleanStyle = {
  fontSize: 14,
  top: 0
}

var dirtyStyle = {
  fontSize: 11,
  top: -17,
}

FloatingLabel.propTypes = {
  disabled: PropTypes.bool,
  style: Text.propTypes.style,
};

module.exports = FloatingLabel;
