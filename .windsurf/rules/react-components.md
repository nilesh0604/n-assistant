# React Component Rules

## Component Structure
- Use functional components with React 18+ features
- Prefer TypeScript interfaces over types for component props
- Use `React.FC` only when explicitly needed

## Styling Requirements
- Use Tailwind CSS for all component styling
- Avoid inline styles or CSS modules
- Use `@tailwind-config` tokens for consistency

## State Management
- Use `useState` for local state
- Use `useContext` for shared state
- Implement `useMemo` and `useCallback` for optimization

## Component Patterns
```typescript
// Preferred component structure
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onSubmit 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = useCallback((data: FormData) => {
    setIsLoading(true);
    onSubmit(data);
  }, [onSubmit]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};
```

## Accessibility
- Implement proper ARIA attributes
- Use semantic HTML elements
- Test with screen readers in mind
