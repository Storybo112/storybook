import { document, DOMParser } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@storybook/components';
import styled from '@emotion/styled';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const storybookIframe = 'storybook-preview-iframe';
const addedElAttr = 'addedbyaddon';

const PanelWrapper = styled.div({
  position: 'absolute',
  top: '10px',
  left: '10px',
});

export default class CodeinjectorPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { code: ``, disable: false };
    this.onAddCode = this.onAddCode.bind(this);
    this.parser = new DOMParser();
  }

  componentDidMount() {
    const { channel } = this.props;
    this.iframe = document.getElementById(storybookIframe);
    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }
    channel.on('storybook/codeinjector/add_code', this.onAddCode);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener('storybook/codeinjector/add_code', this.onAddCode);
  }

  onChange(newValue) {
    this.setState(prevState => ({ ...prevState, code: newValue }));
  }

  onAddCode(code) {
    this.loadCode(code);
    this.setState(prevState => ({ ...prevState, code, disable: false }));
  }

  addElements(domElements, i) {
    if (i < 0 || i >= domElements.length) return;

    const node = this.iframe.contentDocument.head.appendChild(domElements[i]);

    // wait for script's to load before running others!
    // example: load #2 only after loading #1
    // #1  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    // #2  <script type="text/javascript">try{ alert(window.jQuery?'1':'0') } catch(e){ }</script>
    if (node.tagName.toLowerCase() === 'script' && node.src !== '') {
      node.onload = () => {
        this.addElements(domElements, i + 1);
      };
    } else {
      this.addElements(domElements, i + 1);
    }
  }

  apply() {
    const { code = '' } = this.state;
    this.loadCode(code);
    this.setState(prevState => ({ ...prevState, disable: false }));
  }

  convertStringToDom(str) {
    const parsedHtml = this.parser.parseFromString(str, 'text/html');
    const elements = parsedHtml.querySelectorAll('head > *');

    // remove null elements if any!
    return [...elements].map(eL => {
      let newEl;
      if (eL) {
        /** Tried multiple easier ways to convert the string to dOM objects
         DOMParser, jQuery etc. However, adding <script> elements to the iframe
        seems to fail using those methods. The only way that seemed to work for all
        cases was to createElements in this way! */
        newEl = document.createElement(eL.tagName.toLowerCase());
        [...Array(eL.attributes.length).keys()].forEach(idx => {
          const attr = eL.attributes.item(idx).name;
          newEl[attr] = eL[attr];
        });
        while (eL.hasChildNodes()) {
          newEl.appendChild(eL.removeChild(eL.firstChild));
        }
        newEl.setAttribute(addedElAttr, '');
      }
      return newEl;
    });
  }

  disable() {
    this.loadCode(``);
    this.setState(prevState => ({ ...prevState, disable: true }));
  }

  loadCode(code) {
    // remove previously added elements!
    this.iframe.contentDocument.head.querySelectorAll(`[${addedElAttr}]`).forEach(eL => {
      if (eL) {
        eL.parentNode.removeChild(eL);
      }
    });

    this.addElements(this.convertStringToDom(code), 0);
  }

  render() {
    const { code = '', disable = false } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <PanelWrapper className="addon-codeinjector-container">
        <div style={{ fontSize: '15px', paddingBottom: '12px', width: '800px' }}>
          Note: Applying code is sticky and will persist accross stories.
        </div>
        <div>
          <AceEditor
            mode="javascript"
            theme="monokai"
            readOnly={disable}
            setOptions={{ useWorker: false, fontSize: '15px' }}
            onChange={this.onChange.bind(this)}
            style={{ boxShadow: '5px 7px #888888', opacity: disable ? 0.5 : 1.0 }}
            value={code}
            name="codediv"
            height="300px"
            width="800px"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
        <div style={{ float: 'right', paddingTop: '17px' }}>
          <Button onClick={this.apply.bind(this)}>APPLY CODE</Button>
          &nbsp;&nbsp;
          <Button onClick={this.disable.bind(this)}>DISABLE</Button>
        </div>
      </PanelWrapper>
    );
  }
}

CodeinjectorPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
