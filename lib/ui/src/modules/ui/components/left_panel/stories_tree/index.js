import { Treebeard } from 'react-treebeard';
import PropTypes from 'prop-types';
import React from 'react';
import deepEqual from 'deep-equal';
import treeNodeTypes from './tree_node_type';
import createTreeDecorators from './tree_decorators';
import treeStyle from './tree_style';

const namespaceSeparator = '@';
const keyCodeEnter = 13;

function createNodeKey({ namespaces, type }) {
  return [...namespaces, [type]].join(namespaceSeparator);
}

function getSelectedNodes(selectedHierarchy) {
  return selectedHierarchy
    .reduce((nodes, namespace, index) => {
      const node = {};

      node.type =
        selectedHierarchy.length - 1 === index ? treeNodeTypes.COMPONENT : treeNodeTypes.NAMESPACE;

      if (!nodes.length) {
        node.namespaces = [namespace];
      } else {
        const lastNode = nodes[nodes.length - 1];
        node.namespaces = [...lastNode.namespaces, [namespace]];
      }

      nodes.push(node);

      return nodes;
    }, [])
    .reduce((nodesMap, node) => ({ ...nodesMap, [createNodeKey(node)]: true }), {});
}

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.onToggle = this.onToggle.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    const { selectedHierarchy } = this.props;

    this.state = {
      filteredNodes: {},
      nodes: getSelectedNodes(selectedHierarchy),
    };

    this.treeDecorators = createTreeDecorators(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedHierarchy: nextSelectedHierarchy = [],
      storyFilter: nextStoryFilter,
    } = nextProps;

    const {
      selectedHierarchy: currentSelectedHierarchy = [],
      storyFilter: currentStoryFilter,
    } = this.props;

    const shouldClearFilteredNodes = nextStoryFilter !== currentStoryFilter;
    const selectedHierarchyChanged = !deepEqual(nextSelectedHierarchy, currentSelectedHierarchy);

    if (selectedHierarchyChanged || shouldClearFilteredNodes) {
      const selectedNodes = getSelectedNodes(nextSelectedHierarchy);

      this.setState(prevState => ({
        filteredNodes: shouldClearFilteredNodes ? {} : prevState.filteredNodes,
        nodes: {
          ...prevState.nodes,
          ...selectedNodes,
        },
      }));
    }
  }

  onToggle(node, toggled) {
    if (node.story) {
      this.fireOnKindAndStory(node.kind, node.story);
    } else if (node.kind && toggled) {
      this.fireOnKind(node.kind);
    }

    if (!node.namespaces) {
      return;
    }

    this.setState(prevState => ({
      nodes: {
        ...prevState.nodes,
        [node.key]: toggled,
      },
      filteredNodes: {
        ...prevState.filteredNodes,
        [node.key]: !toggled,
      },
    }));
  }

  onKeyDown(event, node) {
    if (event.keyCode === keyCodeEnter) {
      this.onToggle(node, !node.toggled);
    }
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnKindAndStory(kind, story) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, story);
  }

  mapStoriesHierarchy(storiesHierarchy) {
    const { storyFilter } = this.props;

    const treeModel = {
      namespaces: storiesHierarchy.namespaces,
      name: storiesHierarchy.name,
    };

    if (storiesHierarchy.isNamespace) {
      treeModel.type = treeNodeTypes.NAMESPACE;

      if (storiesHierarchy.map.size > 0) {
        treeModel.children = [];

        storiesHierarchy.map.forEach(childItems => {
          childItems.forEach(item => {
            treeModel.children.push(this.mapStoriesHierarchy(item));
          });
        });
      }
    } else {
      const { selectedStory, selectedKind } = this.props;

      treeModel.kind = storiesHierarchy.kind;
      treeModel.type = treeNodeTypes.COMPONENT;

      treeModel.children = storiesHierarchy.stories.map(story => ({
        story,
        storyFilter,
        kind: storiesHierarchy.kind,
        name: story,
        active: selectedStory === story && selectedKind === storiesHierarchy.kind,
        type: treeNodeTypes.STORY,
      }));
    }

    treeModel.key = createNodeKey(treeModel);
    treeModel.toggled = this.isToggled(treeModel, storyFilter);
    treeModel.storyFilter = storyFilter;

    return treeModel;
  }

  isToggled(treeModel, storyFilter) {
    return this.state.nodes[treeModel.key] || this.isFilteredNode(treeModel.key, storyFilter);
  }

  isFilteredNode(key, storyFilter) {
    if (!storyFilter) {
      return false;
    }

    const { filteredNodes } = this.state;

    return !filteredNodes[key];
  }

  render() {
    const { storiesHierarchy } = this.props;

    const data = this.mapStoriesHierarchy(storiesHierarchy);
    data.toggled = true;
    data.root = true;

    return (
      <Treebeard
        style={treeStyle}
        data={data}
        onToggle={this.onToggle}
        decorators={this.treeDecorators}
      />
    );
  }
}

Stories.defaultProps = {
  onSelectStory: null,
  storiesHierarchy: null,
  storyFilter: null,
};

Stories.propTypes = {
  storyFilter: PropTypes.string,
  storiesHierarchy: PropTypes.shape({
    namespaces: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    map: PropTypes.object,
  }),
  selectedHierarchy: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedKind: PropTypes.string.isRequired,
  selectedStory: PropTypes.string.isRequired,
  onSelectStory: PropTypes.func,
};

export default Stories;
