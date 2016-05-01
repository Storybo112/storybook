'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _theme = require('../theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapperStyle = {
  background: '#F7F7F7'
};

var headingStyle = (0, _extends3.default)({}, _theme.baseFonts, {
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '12px',
  fontWeight: 'bolder',
  color: '#828282',
  border: '1px solid #C1C1C1',
  textAlign: 'center',
  borderRadius: '2px',
  padding: '5px',
  cursor: 'pointer',
  margin: 0,
  float: 'none',
  overflow: 'hidden'
});

var shortcutIconStyle = {
  textTransform: 'uppercase',
  letterSpacing: '3.5px',
  fontSize: 12,
  fontWeight: 'bolder',
  color: 'rgb(130, 130, 130)',
  border: '1px solid rgb(193, 193, 193)',
  textAlign: 'center',
  borderRadius: 2,
  padding: 5,
  cursor: 'pointer',
  margin: 0,
  display: 'inlineBlock',
  paddingLeft: 8,
  float: 'right',
  marginLeft: 5
};

var linkStyle = {
  textDecoration: 'none'
};

var Header = function Header(_ref) {
  var showShortcutHelp = _ref.showShortcutHelp;
  return _react2.default.createElement(
    'div',
    { style: wrapperStyle },
    _react2.default.createElement(
      'div',
      { style: shortcutIconStyle },
      '⌘'
    ),
    _react2.default.createElement(
      'a',
      { style: linkStyle, href: 'https://github.com/kadirahq/react-storybook', target: '_blank' },
      _react2.default.createElement(
        'h3',
        { style: headingStyle },
        'React Storybook'
      )
    )
  );
};

exports.default = Header;