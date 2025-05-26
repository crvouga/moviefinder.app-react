import type {
  IfMaybeUndefined,
  IfVoid,
  IsAny,
  IsUnknownOrNonInferrable,
} from './helpers'
import { hasMatchFunction } from './helpers'

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createMsg()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
export type PayloadMsg<
  P = void,
  T extends string = string,
  M = never,
  E = never
> = {
  payload: P
  type: T
} & ([M] extends [never]
  ? {}
  : {
      meta: M
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E
      })

/**
 * A "prepare" method to be used as the second parameter of `createMsg`.
 * Takes any number of arguments and returns a Flux Standard Msg without
 * type (will be added later) that *must* contain a payload (might be undefined).
 *
 * @public
 */
export type PrepareMsg<P> =
  | ((...args: any[]) => { payload: P })
  | ((...args: any[]) => { payload: P; meta: any })
  | ((...args: any[]) => { payload: P; error: any })
  | ((...args: any[]) => { payload: P; meta: any; error: any })

/**
 * Internal version of `MsgCreatorWithPreparedPayload`. Not to be used externally.
 *
 * @internal
 */
export type _MsgCreatorWithPreparedPayload<
  PA extends PrepareMsg<any> | void,
  T extends string = string
> = PA extends PrepareMsg<infer P>
  ? MsgCreatorWithPreparedPayload<
      Parameters<PA>,
      P,
      T,
      ReturnType<PA> extends {
        error: infer E
      }
        ? E
        : never,
      ReturnType<PA> extends {
        meta: infer M
      }
        ? M
        : never
    >
  : void

/**
 * Basic type for all action creators.
 *
 * @inheritdoc {redux#MsgCreator}
 */
export interface BaseMsgCreator<P, T extends string, M = never, E = never> {
  type: T
  is: (action: unknown) => action is PayloadMsg<P, T, M, E>
}

/**
 * An action creator that takes multiple arguments that are passed
 * to a `PrepareMsg` method to create the final Msg.
 * @typeParam Args arguments for the action creator function
 * @typeParam P `payload` type
 * @typeParam T `type` name
 * @typeParam E optional `error` type
 * @typeParam M optional `meta` type
 *
 * @inheritdoc {redux#MsgCreator}
 *
 * @public
 */
export interface MsgCreatorWithPreparedPayload<
  Args extends unknown[],
  P,
  T extends string = string,
  E = never,
  M = never
> extends BaseMsgCreator<P, T, M, E> {
  /**
   * Calling this {@link redux#MsgCreator} with `Args` will return
   * an Msg with a payload of type `P` and (depending on the `PrepareMsg`
   * method used) a `meta`- and `error` property of types `M` and `E` respectively.
   */
  (...args: Args): PayloadMsg<P, T, M, E>
}

/**
 * An action creator of type `T` that takes an optional payload of type `P`.
 *
 * @inheritdoc {redux#MsgCreator}
 *
 * @public
 */
export interface MsgCreatorWithOptionalPayload<P, T extends string = string>
  extends BaseMsgCreator<P, T> {
  /**
   * Calling this {@link redux#MsgCreator} with an argument will
   * return a {@link PayloadMsg} of type `T` with a payload of `P`.
   * Calling it without an argument will return a PayloadMsg with a payload of `undefined`.
   */
  (payload?: P): PayloadMsg<P, T>
}

/**
 * An action creator of type `T` that takes no payload.
 *
 * @inheritdoc {redux#MsgCreator}
 *
 * @public
 */
export interface MsgCreatorWithoutPayload<T extends string = string>
  extends BaseMsgCreator<undefined, T> {
  /**
   * Calling this {@link redux#MsgCreator} will
   * return a {@link PayloadMsg} of type `T` with a payload of `undefined`
   */
  (noArgument: void): PayloadMsg<undefined, T>
}

/**
 * An action creator of type `T` that requires a payload of type P.
 *
 * @inheritdoc {redux#MsgCreator}
 *
 * @public
 */
export interface MsgCreatorWithPayload<P, T extends string = string>
  extends BaseMsgCreator<P, T> {
  /**
   * Calling this {@link redux#MsgCreator} with an argument will
   * return a {@link PayloadMsg} of type `T` with a payload of `P`
   */
  (payload: P): PayloadMsg<P, T>
}

/**
 * An action creator of type `T` whose `payload` type could not be inferred. Accepts everything as `payload`.
 *
 * @inheritdoc {redux#MsgCreator}
 *
 * @public
 */
export interface MsgCreatorWithNonInferrablePayload<T extends string = string>
  extends BaseMsgCreator<unknown, T> {
  /**
   * Calling this {@link redux#MsgCreator} with an argument will
   * return a {@link PayloadMsg} of type `T` with a payload
   * of exactly the type of the argument.
   */
  <PT extends unknown>(payload: PT): PayloadMsg<PT, T>
}

/**
 * An action creator that produces actions with a `payload` attribute.
 *
 * @typeParam P the `payload` type
 * @typeParam T the `type` of the resulting action
 * @typeParam PA if the resulting action is preprocessed by a `prepare` method, the signature of said method.
 *
 * @public
 */
export type PayloadMsgCreator<
  P = void,
  T extends string = string,
  PA extends PrepareMsg<P> | void = void
> = IfPrepareMsgMethodProvided<
  PA,
  _MsgCreatorWithPreparedPayload<PA, T>,
  // else
  IsAny<
    P,
    MsgCreatorWithPayload<any, T>,
    IsUnknownOrNonInferrable<
      P,
      MsgCreatorWithNonInferrablePayload<T>,
      // else
      IfVoid<
        P,
        MsgCreatorWithoutPayload<T>,
        // else
        IfMaybeUndefined<
          P,
          MsgCreatorWithOptionalPayload<P, T>,
          // else
          MsgCreatorWithPayload<P, T>
        >
      >
    >
  >
>

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overridden so that it returns the action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass its arguments to this method to calculate payload & meta.
 *
 * @public
 */
export function createMsg<P = void, T extends string = string>(
  type: T
): PayloadMsgCreator<P, T>

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overridden so that it returns the action type.
 *
 * @param type The action type to use for created actions.
 * @param prepare (optional) a method that takes any number of arguments and returns { payload } or { payload, meta }.
 *                If this is given, the resulting action creator will pass its arguments to this method to calculate payload & meta.
 *
 * @public
 */
export function createMsg<
  PA extends PrepareMsg<any>,
  T extends string = string
>(type: T, prepareMsg: PA): PayloadMsgCreator<ReturnType<PA>['payload'], T, PA>

export function createMsg(type: string, prepareMsg?: Function): any {
  function actionCreator(...args: any[]) {
    if (prepareMsg) {
      let prepared = prepareMsg(...args)
      if (!prepared) {
        throw new Error('prepareMsg did not return an object')
      }

      return {
        type,
        payload: prepared.payload,
        ...('meta' in prepared && { meta: prepared.meta }),
        ...('error' in prepared && { error: prepared.error }),
      }
    }
    return { type, payload: args[0] }
  }

  actionCreator.toString = () => `${type}`

  actionCreator.type = type

  actionCreator.is = (action: unknown): action is PayloadMsg =>
    isMsg(action) && action.type === type

  return actionCreator
}

/**
 * Returns true if value is an RTK-like action creator, with a static type property and match method.
 */
export function isMsgCreator(
  action: unknown
): action is BaseMsgCreator<unknown, string> & Function {
  return (
    typeof action === 'function' &&
    'type' in action &&
    // hasMatchFunction only wants Matchers but I don't see the point in rewriting it
    hasMatchFunction(action as any)
  )
}

/**
 * Returns true if value is an action with a string type and valid Flux Standard Msg keys.
 */
export function isFSA(action: unknown): action is {
  type: string
  payload?: unknown
  error?: unknown
  meta?: unknown
} {
  return isMsg(action) && Object.keys(action).every(isValidKey)
}

export type Msg = { type: string }

export function isMsg(action: unknown): action is { type: string } {
  return (
    typeof action === 'object' &&
    action !== null &&
    typeof (action as any).type === 'string'
  )
}

function isValidKey(key: string) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1
}

// helper types for more readable typings

type IfPrepareMsgMethodProvided<
  PA extends PrepareMsg<any> | void,
  True,
  False
> = PA extends (...args: any[]) => any ? True : False

/**
 * Enhances the createMsg function to include a namespace prefix to the action type.
 *
 * @param namespace The namespace to prepend to the action type.
 * @returns A function that creates namespaced messages.
 */
export function createNamespace(namespace: string) {
  return function <
    P = void,
    T extends string = string,
    PA extends PrepareMsg<P> | void = void
  >(type: T, prepareMsg?: PA): PayloadMsgCreator<P, `${string}/${T}`, PA> {
    // @ts-ignore
    return createMsg(`${namespace}/${type}`, prepareMsg) as PayloadMsgCreator<
      P,
      `${string}/${T}`,
      PA
    >
  }
}
