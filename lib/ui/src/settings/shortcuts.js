import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@storybook/components';
import { Route } from '@storybook/router';
import { isShortcutTaken, keyToSymbol, labelsArr, mapToKeyEl, parseKey } from './utils';
import {
  A,
  Button,
  ColWrapper,
  Container,
  Description,
  Footer,
  GridHeaderRow,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  HotKeyWrapper,
  KeyInputWrapper,
  Main,
  Row,
  SuccessIcon,
  TextInput,
  Title,
  TitleText,
  Wrapper,
} from './components';

function toShortcutState(shortcutKeys) {
  return Object.entries(shortcutKeys).reduce(
    (acc, [action, value]) => ({ ...acc, [action]: { value, error: false } }),
    {}
  );
}

class ShortcutsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeInputField: '',
      inputArr: [],
      successField: '',
      // The initial shortcutKeys that come from props are the defaults/what was saved
      // As the user interacts with the page, the state stores the temporary, unsaved shortcuts
      // This object also includes the error attached to each shortcut
      shortcutKeys: toShortcutState(props.shortcutKeys),
    };
  }

  duplicateFound = () => {
    const { shortcutKeys, activeInputField, inputArr } = this.state;
    const match = Object.entries(shortcutKeys).filter(
      i => i[0] !== activeInputField && isShortcutTaken(inputArr, i[1].value)
    );

    return !!match.length;
  };

  submitKeyHandler = () => {
    const { inputArr, shortcutKeys, activeInputField } = this.state;
    if (inputArr.length === 0 || shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault();
    }
    return undefined;
  };

  handleBackspace = () => {
    const { shortcutKeys, activeInputField } = this.state;
    this.setState(state => {
      const updatedArray = state.inputArr;
      updatedArray.splice(-1);

      return {
        inputArr: updatedArray,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: updatedArray, error: false },
        },
      };
    });
  };

  onKeyDown = e => {
    if (e.key === 'Backspace') {
      return this.handleBackspace(e);
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      return this.submitKeyHandler();
    }

    const { shortcutKeys, activeInputField } = this.state;
    const parsedKey = keyToSymbol(parseKey(e)[0]);

    return this.setState(state => {
      const lengthTooLong = [...state.inputArr, parsedKey].length > 3;
      const newValue = state.inputArr.length < 3 ? [...state.inputArr, parsedKey] : state.inputArr;
      return {
        inputArr: newValue,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: newValue, error: lengthTooLong },
        },
      };
    });
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;

    this.setState({
      activeInputField: focusedInput,
      inputArr: [],
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { value: [], error: false } },
    });
  };

  onBlur = () => {
    const { shortcutKeys, inputArr, activeInputField } = this.state;

    if (shortcutKeys[activeInputField] && shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault();
    }
    if (this.duplicateFound()) {
      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputArr, error: true } },
      });
    }
    return this.saveShortcut(activeInputField);
  };

  saveShortcut = () => {
    const { activeInputField, inputArr, shortcutKeys } = this.state;

    const { setShortcut } = this.props;
    setShortcut(activeInputField, inputArr);
    this.setState({
      successField: activeInputField,
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputArr, error: false } },
    });
  };

  restoreDefaults = () => {
    const { restoreAllDefaultShortcuts } = this.props;

    const defaultShortcuts = restoreAllDefaultShortcuts();
    this.setState({ shortcutKeys: toShortcutState(defaultShortcuts) });
  };

  restoreDefault = () => {
    const { activeInputField, shortcutKeys } = this.state;

    const { restoreDefaultShortcut } = this.props;

    const defaultShortcut = restoreDefaultShortcut(activeInputField);
    this.setState({
      inputArr: defaultShortcut,
      shortcutKeys: {
        ...shortcutKeys,
        ...toShortcutState({ [activeInputField]: defaultShortcut }),
      },
    });
  };

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'success'
      : '';
  };

  displayError = activeElement => {
    const { activeInputField, shortcutKeys } = this.state;
    return activeElement === activeInputField && shortcutKeys[activeElement].error === true
      ? 'error'
      : '';
  };

  renderKeyInput = () => {
    const { shortcutKeys } = this.state;
    const arr = Object.entries(shortcutKeys).map((shortcut, i) => {
      const transformedKeyStr = shortcut[1].value.length
        ? mapToKeyEl(shortcut[1].value).join('')
        : '';
      return (
        shortcut && (
          <Row key={`${shortcut[0]}`}>
            <Description>{`${labelsArr[i]}`}</Description>
            <KeyInputWrapper>
              <HotKeyWrapper>
                <TextInput
                  spellCheck="false"
                  colorTheme={this.displayError(shortcut[0])}
                  className="modalInput"
                  onBlur={this.onBlur}
                  onFocus={this.onFocus(shortcut[0])}
                  onKeyDown={this.onKeyDown}
                  value={transformedKeyStr}
                />
              </HotKeyWrapper>
            </KeyInputWrapper>

            <SuccessIcon colorTheme={this.displaySuccessMessage(shortcut[0])}>
              <Icons height={20} icon="check" />
            </SuccessIcon>
          </Row>
        )
      );
    });
    return arr;
  };

  renderKeyForm = () => (
    <GridWrapper>
      <GridHeaderRow>
        <HeaderItem>Commands</HeaderItem>
        <HeaderItem>Shortcut</HeaderItem>
      </GridHeaderRow>
      {this.renderKeyInput()}
    </GridWrapper>
  );

  render() {
    const layout = this.renderKeyForm();
    return (
      <Route path="shortcuts">
        <Container>
          <Wrapper>
            <Title>
              <TitleText>Keyboard Shortcuts</TitleText>
            </Title>
          </Wrapper>
          <ColWrapper>
            <Main>
              <Heading>
                <Header>
                  <Button id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                    Restore Defaults
                  </Button>
                </Header>
              </Heading>
              {layout}
            </Main>
          </ColWrapper>
          <Wrapper>
            <Footer>
              <A href="https://storybook.js.org">Storybook docs</A>
              <A href="https://github.com/storybooks/storybook">GitHub</A>
              <A href="https://storybook.js.org/support">Support</A>
            </Footer>
          </Wrapper>
        </Container>
      </Route>
    );
  }
}

ShortcutsScreen.propTypes = {
  shortcutKeys: PropTypes.shape({}).isRequired, // Need TS for this
  setShortcut: PropTypes.func.isRequired,
  restoreDefaultShortcut: PropTypes.func.isRequired,
  restoreAllDefaultShortcuts: PropTypes.func.isRequired,
};

export default ShortcutsScreen;
