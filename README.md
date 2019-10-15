## Why use hooks

### Drawbacks of Class Components:
- Need to call super()
- Confusing(or not) 'this' binding
- Life cycle methods force non-related logic being put togather
```
class MyComponent extends React.Component {
    componentDidMount() {
        // These two parts are not logically related yet we need to put them togather
        fetchData();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll'. this.handleScroll);
    }
    
    handleScroll() {...}
    
	  render() {...}
}
```
- Classes are less effecient in minification
- Hard to reuse non-visual logic
```
class FriendAvatar extends React.Component {
    state = {
        isLoading: false,
        friendData: {},
    };

    componentDidMount() {
        this.setState({ isLoading: true }, () => {
            getFriendDataById(this.props.id).then(friendData => this.setState({ friendData, isLoading: false }));
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.setState({ isLoading: true }, () => {
                getFriendDataById(this.props.id).then(friendData => this.setState({ friendData, isLoading: false }));
            }); // Same data fetching logic need to be repeated
        }
    }

	render() {
        if (this.state.isLoading) return <div>Loading...</div>;

        return (
            <div><img src={this.state.friendData.avatar} alt="avatar" /></div>
        );
    }
}
```
- HOC and render props pattern may cause wrapper hell(because what they are really doing is most likely non-UI work but we need to make them components)
```
// Extracted data fetching logic but there is still some duplication inside the HOC
const withFriend = Component => {
    return class WithFriendWrapper extends React.Component {
        state = {
            isLoading: false,
            friendData: {},
        };

        componentDidMount() {
            this.setState({ isLoading: true }, () => {
                getFriendDataById(this.props.id).then(friendData => this.setState({ friendData, isLoading: false }));
            });
        }

        componentDidUpdate(prevProps) {
            if (prevProps.id !== this.props.id) {
                this.setState({ isLoading: true }, () => {
                    getFriendDataById(this.props.id).then(friendData => this.setState({ friendData, isLoading: false }));
                });
            }
        }

        render() {
            return <Component {...this.props} isLoading={this.state.isLoading} friendData={this.state.friendData} />;
        }
    }
};

// Usage
withFriend(FriendAvatar); // this creates a wrapper component
```
- function cannot be part of the data flow
- Side effects are not driven by props and state(bacause the mutable 'this' object) which is a common source of bugs

### Benifits of Hooks:
- Don't add unnecessary component hierarchy
- Group related logic togather
- Make non-visual logic easy to reuse
- No complex HOC or render props pattern anymore
- Make components easy to split
- Reduce bundle size(slightly)
- Don't block browser from updating pages(useEffect runs after reflow and painting)

## Hooks Best Practices:
- Should only be called inside a React component
- Should be called in a way that subsequent renders wouldn't change the calling order of hooks(e.g not inside loops or if statements)
- Be careful with hooks/event handlers that use component props or state, make sure to add these props or state to the dependency array(the 2nd argument of certain hooks, e.g useEffect), otherwise you may get stale props or state
- Define side effect functions inside `useEffect`
- If side effect functions can't be defined inside `useEffect`(e.g shared logic), hoist them outside the component or use `useCallback`

## Tools for Hooks:
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks): checks patterns that are not recommended
