import React from 'react';
import { mount, shallow } from 'enzyme';
import ShortcutsScreen from './shortcuts';

// A limited set of keys we use in this test file
const shortcutKeys = {
  fullScreen: ['F'],
  togglePanel: ['S'],
  navigation: ['A'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
};

const actions = {
  setShortcut: jest.fn(),
  restoreDefaultShortcut: jest.fn().mockImplementation(action => shortcutKeys[action]),
  restoreAllDefaultShortcuts: jest.fn().mockReturnValue(shortcutKeys),
};

describe('ShortcutsScreen', () => {
  it('renders correctly', () => {
    const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
    expect(comp).toExist();
  });

  it('handles a full mount', () => {
    const comp = mount(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
    expect(comp).toExist();
    comp.unmount();
  });

  describe('duplicateFound', () => {
    it('returns true if there are duplicates', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'fullScreen', inputArr: ['S'] });
      const instance = comp.instance();

      expect(instance.duplicateFound()).toEqual(true);
    });

    it('returns false if there are no duplicates', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'fullScreen', inputArr: ['R'] });
      const instance = comp.instance();

      expect(instance.duplicateFound()).toEqual(false);
    });
  });

  describe('submitKeyHandler', () => {
    it('restores the default if the input array is empty', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({
        activeInputField: 'togglePanel',
        inputArr: [],
        shortcutKeys: { togglePanel: { value: [] } },
      });
      const instance = comp.instance();
      const spy = jest.spyOn(instance, 'restoreDefault');
      instance.submitKeyHandler();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('returns undefined if inputArray has keys in it', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({
        activeInputField: 'togglePanel',
        inputArr: ['R', '1'],
        shortcutKeys: { togglePanel: { value: ['R', '1'] } },
      });
      const instance = comp.instance();

      expect(comp.state('shortcutKeys').togglePanel.value).toHaveLength(2);
      expect(instance.submitKeyHandler()).toBeUndefined();
    });
  });

  describe('handleBackspace', () => {
    it('cuts the last element from the inputArr', () => {
      const expected = ['A', 'B'];
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'navigation', inputArr: ['A', 'B', 'C'] });
      const instance = comp.instance();
      instance.handleBackspace();
      expect(comp.state('shortcutKeys').navigation.value).toEqual(expect.arrayContaining(expected));
      expect(comp.state('shortcutKeys').navigation.value).not.toContain('C');
      expect(comp.state('shortcutKeys').navigation.value).toHaveLength(2);
    });
  });

  describe('onKeyDown', () => {
    it('calls handleBackspace if Backspace key is pressed', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      comp.setState({ activeInputField: 'focusIframe', inputArr: ['A', 'B', 'C'] });

      const spy = jest.spyOn(instance, 'handleBackspace');
      instance.onKeyDown({ key: 'Backspace' });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls submitKeyHandler if Tab key is pressed', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'focusIframe', inputArr: ['A', 'B', 'C'] });
      const instance = comp.instance();
      const spy = jest.spyOn(instance, 'submitKeyHandler');
      instance.onKeyDown({ key: 'Tab' });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls submitKeyHandler if Enter key is pressed', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'focusIframe', inputArr: ['A', 'B', 'C'] });
      const instance = comp.instance();
      const spy = jest.spyOn(instance, 'submitKeyHandler');
      instance.onKeyDown({ key: 'Enter' });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('sets state for regular key down events', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      comp.setState({ activeInputField: 'search', inputArr: [] });
      const instance = comp.instance();
      instance.onKeyDown({ key: 'M' });

      const shortcut = comp.state('shortcutKeys').search.value;
      expect(shortcut).toHaveLength(1);
      expect(shortcut).toContain('M');
      expect(comp.state('inputArr')).toContain('M');
    });
  });

  describe('onFocus', () => {
    it('calls setstate and clears the input on focus', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();

      instance.onFocus('toolbar')();
      expect(comp.state('shortcutKeys').toolbar.value).toHaveLength(0);
      expect(comp.state('inputArr')).toHaveLength(0);
      expect(comp.state('activeInputField')).toBe('toolbar');
    });
  });

  describe('onBlur', () => {
    it('if the input is empty, restores the respective default', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      comp.setState({
        activeInputField: 'focusNav',
        inputArr: [],
        shortcutKeys: { ...comp.state.shortcutKeys, focusNav: { value: [] } },
      });

      instance.onBlur();

      expect(comp.state('shortcutKeys').focusNav.value).toHaveLength(1);
      expect(comp.state('shortcutKeys').focusNav.value).toContain('1');
    });

    it('if a duplicate is found, it sets error to true', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      comp.setState({
        activeInputField: 'fullScreen',
        inputArr: ['S'],
      });

      instance.onBlur();
      expect(comp.state('shortcutKeys').fullScreen.error).toBe(true);
    });

    it('it saves the shortcut if it is valid', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      comp.setState({ activeInputField: 'focusNav', inputArr: ['V', 'P'] });

      instance.onBlur();
      const spy = jest.spyOn(instance, 'saveShortcut');
      instance.onBlur();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveShortcut', () => {
    it('if the input is empty, restores the respective default', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      comp.setState({
        activeInputField: 'focusNav',
        inputArr: [],
        shortcutKeys: { focusNav: { value: [] } },
      });

      instance.onBlur();
      expect(comp.state('shortcutKeys').focusNav.value).toEqual(['1']);
    });
  });

  describe('restoreDefaults', () => {
    it('if the input is empty, restores the respective default', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);

      comp.setState({
        activeInputField: 'focusNav',
        inputArr: ['G', 'H'],
        shortcutKeys: { focusNav: { value: ['G', 'H'], error: false } },
      });
      comp.find('#restoreDefaultsHotkeys').simulate('click');
      const newState = comp.state('shortcutKeys').focusNav.value;

      expect(newState).toEqual(['1']);
    });
  });
});
