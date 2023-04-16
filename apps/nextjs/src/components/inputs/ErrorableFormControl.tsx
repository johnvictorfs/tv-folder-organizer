import { FormControl, type FormControlProps, FormHelperText, Box } from '@mui/joy'

export type ErrorableFormControlProps = {
  errorMessage?: string
  children: React.ReactNode
} & FormControlProps

export const ErrorableFormControl: React.FC<ErrorableFormControlProps> = ({
  errorMessage,
  children,
  ...formControlProps
}) => {
  return (
    <FormControl
      {...formControlProps}
      sx={theme => ({
        border: errorMessage ? `2px solid ${theme.palette.danger[800]}` : undefined,
        borderRadius: 8,
        mt: 2,
      })}
    >
      <Box sx={{ p: 1 }}>
        {children}
      </Box>

      <FormHelperText sx={{ m: 1 }}>
        {errorMessage}
      </FormHelperText>
    </FormControl>
  )
}
