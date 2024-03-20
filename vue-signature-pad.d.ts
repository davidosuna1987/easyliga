declare module 'vue-signature-pad' {
  import {
    ComponentPublicInstance,
    ComponentOptions,
    ComputedOptions,
    Plugin,
    MethodOptions,
  } from 'vue'

  type ComponentConstructor<
    Component extends ComponentPublicInstance<
      Props,
      RawBindings,
      D,
      C,
      M
    > = ComponentPublicInstance<any>,
    Props = any,
    RawBindings = any,
    D = any,
    C extends ComputedOptions = ComputedOptions,
    M extends MethodOptions = MethodOptions,
  > = { new (): Component } & ComponentOptions<Props, RawBindings, D, C, M>

  export interface VueSignaturePadProps {
    width?: string
    height?: string
    saveType?: string
    options?: Record<string, any>
    images?: []
    customStyle?: CSSStyleDeclaration
  }

  export type SaveSignatureReturnType = {
    isEmpty: boolean
    data?: string
  }

  export interface VueSignaturePad
    extends ComponentPublicInstance<VueSignaturePadProps> {
    saveSignature(
      type?: string,
      encoderOptions?: number,
    ): SaveSignatureReturnType
    undoSignature(): void
    clearSignature(): void
    // eslint-disable-next-line @typescript-eslint/ban-types
    mergeImagesAndSignature(signature: object | string): void
    addImages(images: []): void
    lockSignaturePad(): void
    openSignaturePad(): void
    getPropImagesAndCacheImages(): void
    clearCacheImages(): void
    fromDataURL(data: string): void
    isEmpty(): boolean
    toData(): string
  }

  export const VueSignaturePad: ComponentConstructor<VueSignaturePad>
  const plugin: Plugin
  export default plugin
}
