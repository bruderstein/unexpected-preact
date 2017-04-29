
import { h } from 'preact';
import UnexpectedHtmlLike from 'unexpected-htmllike';
import RawAdapter from 'unexpected-htmllike-raw-adapter';
import PreactElementAdapter from 'unexpected-htmllike-preact-adapter';
import PreactRenderedAdapter from 'unexpected-htmllike-preactrendered-adapter';

const PreactVNode = Object.getPrototypeOf(h('div'));

function installInto(expect) {

    const preactRenderedAdapter = new PreactRenderedAdapter({ includeKeyProp: true, convertToString: true, concatTextContent: true });
    const htmlLikePreactRendered = UnexpectedHtmlLike(preactRenderedAdapter);
    const rawAdapter = new RawAdapter({ convertToString: true, concatTextContent: true });
    const htmlLikeRaw = UnexpectedHtmlLike(rawAdapter);
    const preactAdapter = new PreactElementAdapter({ includeKeyProp: true });
    const htmlLikePreactElement = UnexpectedHtmlLike(preactAdapter);

    expect.addType({

        name: 'RenderedPreactElement',

        base: 'object',
        identify(value) {
            return typeof value === 'object' &&
                value !== null &&
                (typeof value._component === 'object' ||
                 typeof value.__preact_attr_ === 'object' ||
                 (value.base &&                         // Following for component instance returned from preact-compat render
                  value.hasOwnProperty('props') &&
                  value.hasOwnProperty('context') &&
                  typeof value.setState === 'function'));
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

    expect.addType({
      name: 'ReactRawObjectElement',
      base: 'object',
      identify: function (value) {
        return rawAdapter.isRawElement(value);
      },

      inspect: function (value, depth, output, inspect) {
        return htmlLikeRaw.inspect(value, depth, output, inspect);
      }
    });
}

export default { installInto };
