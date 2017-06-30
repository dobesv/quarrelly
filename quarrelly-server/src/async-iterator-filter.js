import { $$asyncIterator } from 'iterall';

// Skip elements in a graphql-subscriptions style AsyncIterator that fail
// the given predicate.  If the done flag is true but the value is undefined,
// that means the  "last" value did not pass the filter.
export default (filterFn, asyncIterator) => {
    const next = () => asyncIterator.next().then((payload) => 
        filterFn(payload.value) ?  // Check predicate
        Promise.resolve(payload) : // Value passes, pass this result along
        payload.done ? // Last value ?
        Promise.resolve({done: payload.done}) : // Value failed but we are done, so return done == true and null value
        next() // Did not pass, try to read the next one
    );
    const filteredAsyncIterator = {
        next,
        return: asyncIterator.return,
        throw: asyncIterator.throw,
        [$$asyncIterator] : () => filteredAsyncIterator
    }
    return filteredAsyncIterator;
};

