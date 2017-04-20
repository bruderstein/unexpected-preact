
import { h } from 'preact';
import UnexpectedHtmlLike from 'unexpected-htmllike';
// import RawAdapter from 'unexpected-htmllike-raw-adapter';
import PreactElementAdapter from 'unexpected-htmllike-preact-adapter';
import PreactRenderedAdapter from 'unexpected-htmllike-preactrendered-adapter';

const PreactVNode = Object.getPrototypeOf(h('div'));

function installInto(expect) {

    const preactRenderedAdapter = new PreactRenderedAdapter({ convertToString: true, concatTextContent: true });
    const htmlLikePreactRendered = UnexpectedHtmlLike(preactRenderedAdapter);
    // const rawAdapter = new RawAdapter({ convertToString: true, concatTextContent: true });
    // const htmlLikeRaw = UnexpectedHtmlLike(rawAdapter);
    const preactAdapter = new PreactElementAdapter();
    const htmlLikePreactElement = UnexpectedHtmlLike(preactAdapter);

    expect.addType({

        name: 'RenderedPreactElement',

        base: 'object',
        identify(value) {
            return typeof value === 'object' &&
                value !== null &&
                (typeof value._component === 'object' ||
                 typeof value.__preact_attr_ === 'object' ||
                 typeof value.__preact_attr === 'object');
        },

        inspect(value, depth, output, inspect) {
             return htmlLikePreactRendered.inspect(PreactRenderedAdapter.wrapNode(value), depth, output, inspect);
        }
    });

    expect.addType({
      name: 'RenderedPreactElementWrapper',

      identify(value) {
        return typeof value === 'object' &&
          value !== null &&
          (value.type === PreactRenderedAdapter.COMPONENT_TYPE ||
           value.type === PreactRenderedAdapter.NODE_TYPE
          );
      },

      inspect(value, depth, output, inspect) {
        return htmlLikePreactRendered.inspect(value, depth, output, inspect);
      }

    });


    expect.addType({
        name: 'PreactElement',

        identify: function (value) {
            return (typeof value === 'object' &&
                value !== null &&
                Object.getPrototypeOf(value) === PreactVNode);
        },

        inspect: function (value, depth, output, inspect) {
            return htmlLikePreactElement.inspect(value, depth, output, inspect);
        }
    });
}

export default { installInto };
