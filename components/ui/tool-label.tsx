import { Badge } from "@/components/ui/badge"
import { ToolLabel } from "@/hooks/use-tool-labels"

interface ToolLabelProps {
  label: ToolLabel
  className?: string
}

export function ToolLabelBadge({ label, className = "" }: ToolLabelProps) {
  const getStatusConfig = (status: ToolLabel['status']) => {
    switch (status) {
      case 'development':
        return {
          text: 'Em Desenvolvimento',
          bgColor: 'bg-yellow-600/20',
          textColor: 'text-yellow-300',
          borderColor: 'border-yellow-600/30',
          icon: '🔧'
        }
      case 'available':
        return {
          text: 'Disponível',
          bgColor: 'bg-green-600/20',
          textColor: 'text-green-300',
          borderColor: 'border-green-600/30',
          icon: '✅'
        }
      case 'premium':
        return {
          text: 'Premium',
          bgColor: 'bg-purple-600/20',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-600/30',
          icon: '⭐'
        }
      case 'beta':
        return {
          text: 'Beta',
          bgColor: 'bg-blue-600/20',
          textColor: 'text-blue-300',
          borderColor: 'border-blue-600/30',
          icon: '🧪'
        }
      default:
        return {
          text: label.name,
          bgColor: 'bg-gray-600/20',
          textColor: 'text-gray-300',
          borderColor: 'border-gray-600/30',
          icon: '🏷️'
        }
    }
  }

  const config = getStatusConfig(label.status)

  return (
    <Badge 
      className={`${config.bgColor} ${config.textColor} ${config.borderColor} border text-xs font-medium px-2 py-1 ${className}`}
      title={label.description}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  )
}
