import { $$asyncIterator } from 'iterall';

// Transform each value in a graphql-subscriptions style AsyncIterator using
// a function.
export default (mapFn, asyncIterator) => {
    const mapCb = ({value, done}) => ({
            value: mapFn(value),
            done
    });
    const next = () => asyncIterator.next().then(mapCb);
    const _return = () => asyncIterator.return().then(mapCb);
    const mappedAsyncIterator = {
        next,
        return : _return,
        throw: asyncIterator.throw,
        [$$asyncIterator] : () => mappedAsyncIterator
    };
    return mappedAsyncIterator;
};
