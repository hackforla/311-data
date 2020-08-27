## Config Files

### Purpose

**These files are NOT a place to store environment variables that would otherwise be included in the Javascript bundle.** 

Rather, they present a way to quickly and easily toggle features within the app depending on the build (development or production). The config values are not compiled into the main Javascript bundle, thus, config settings can be updated without having to rebuild the entire app. This introduces some flexibility into a strictly linear deployment pipeline.


### How to access config variables

The `APP_CONFIG` object is placed on `window.app.config`. Config variable values are accessed at `window.app.config.<variable_name>`.


### Example

```
#config.development.js

var APP_CONFIG = Object.freeze({
  exampleFeatureEnabled: true,
});



#ExampleComponent.jsx

class ExampleComponent extends Component {
  
  ...

  render() {
    return (
      {window.app.config.exampleFeatureEnabled ? (
        <exampleFeature code>
      ) : (
        <alternate feature code>
      )}
    )
  }
};
```
