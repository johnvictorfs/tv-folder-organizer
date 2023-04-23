import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps } from 'react-hook-form'
import { type z } from 'zod'

/**
 * https://kitchen-sink.trpc.io/react-hook-form
 */
export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(props.schema, undefined),
  })

  return form
}
