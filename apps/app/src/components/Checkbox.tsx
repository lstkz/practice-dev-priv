import tw from 'twin.macro';

interface CheckboxProps {
  id: string;
  name: string;
  children: React.ReactNode;
  disabled?: boolean;
  radio?: boolean;
}

export function Checkbox(props: CheckboxProps) {
  const { id, name, children, disabled, radio } = props;
  return (
    <div className="flex items-center">
      <input
        disabled={disabled}
        id={id}
        name={name}
        type={radio ? 'radio' : 'checkbox'}
        css={[
          tw`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300`,
          disabled && tw`border-gray-200`,
        ]}
      />
      <label
        htmlFor={id}
        className="ml-3 block text-sm font-medium text-gray-700"
        css={[
          tw`ml-3 block text-sm font-medium text-gray-700`,
          disabled && tw`text-gray-400`,
        ]}
      >
        {children}
      </label>
    </div>
  );
}
