import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">João Silva</p>
          <p className="text-sm text-muted-foreground">joao.silva@example.com</p>
        </div>
        <div className="ml-auto font-medium">+R$120,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Maria Alves</p>
          <p className="text-sm text-muted-foreground">maria.alves@example.com</p>
        </div>
        <div className="ml-auto font-medium">+R$85,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pedro Santos</p>
          <p className="text-sm text-muted-foreground">pedro.santos@example.com</p>
        </div>
        <div className="ml-auto font-medium">+R$65,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>LC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Luiza Costa</p>
          <p className="text-sm text-muted-foreground">luiza.costa@example.com</p>
        </div>
        <div className="ml-auto font-medium">+R$150,00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback>RF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rafael Ferreira</p>
          <p className="text-sm text-muted-foreground">rafael.ferreira@example.com</p>
        </div>
        <div className="ml-auto font-medium">+R$95,00</div>
      </div>
    </div>
  )
}
