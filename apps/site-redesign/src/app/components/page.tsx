"use client"

import {
  Bold,
  Italic,
  Underline,
  Terminal,
  AlertCircle,
  Settings,
  User,
  CreditCard,
  Keyboard,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { Banner } from "@/components/sections/banner"
import { HeroCentered } from "@/components/sections/hero-centered"
import { HeroSplit } from "@/components/sections/hero-split"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { FeatureGrid } from "@/components/sections/feature-grid"
import { FeatureRows } from "@/components/sections/feature-rows"
import { Comparison } from "@/components/sections/comparison"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Stats } from "@/components/sections/stats"
import { TestimonialCards } from "@/components/sections/testimonial-cards"
import { TestimonialSingle } from "@/components/sections/testimonial-single"
import { PricingCards } from "@/components/sections/pricing-cards"
import { PricingToggle } from "@/components/sections/pricing-toggle"
import { Faq } from "@/components/sections/faq"
import { CtaSimple } from "@/components/sections/cta-simple"
import { CtaSplit } from "@/components/sections/cta-split"
import { TeamGrid } from "@/components/sections/team-grid"
import { FounderLetter } from "@/components/sections/founder-letter"
import { BlogGrid } from "@/components/sections/blog-grid"
import { ContactForm } from "@/components/sections/contact-form"
import { VideoEmbed } from "@/components/sections/video-embed"
import { IntegrationGrid } from "@/components/sections/integration-grid"
import { Newsletter } from "@/components/sections/newsletter"
import { CookieConsent } from "@/components/sections/cookie-consent"

import { HeroVideo } from "@/components/relume/hero-video"
import { FeatureTabs } from "@/components/relume/feature-tabs"
import { FeatureAccordion } from "@/components/relume/feature-accordion"
import { TestimonialCarousel } from "@/components/relume/testimonial-carousel"
import { LogoCarousel } from "@/components/relume/logo-carousel"
import { CountdownCta } from "@/components/relume/countdown-cta"
import { CaseStudyCarousel } from "@/components/relume/case-study-carousel"
import { VideoTestimonial } from "@/components/relume/video-testimonial"
import { GalleryGrid } from "@/components/relume/gallery-grid"
import { CareerList } from "@/components/relume/career-list"

// ---------------------------------------------------------------------------
// Tab 1 – Design Tokens
// ---------------------------------------------------------------------------

const colorTokens = [
  { name: "primary", className: "bg-primary" },
  { name: "primary-foreground", className: "bg-primary-foreground" },
  { name: "secondary", className: "bg-secondary" },
  { name: "secondary-foreground", className: "bg-secondary-foreground" },
  { name: "muted", className: "bg-muted" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-foreground", className: "bg-accent-foreground" },
  { name: "destructive", className: "bg-destructive" },
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card" },
  { name: "card-foreground", className: "bg-card-foreground" },
  { name: "popover", className: "bg-popover" },
  { name: "popover-foreground", className: "bg-popover-foreground" },
  { name: "border", className: "bg-border" },
  { name: "input", className: "bg-input" },
  { name: "ring", className: "bg-ring" },
]

const radiusTokens = [
  { name: "--radius-sm", className: "rounded-sm" },
  { name: "--radius-md", className: "rounded-md" },
  { name: "--radius-lg", className: "rounded-lg" },
  { name: "--radius-xl", className: "rounded-xl" },
  { name: "--radius-2xl", className: "rounded-2xl" },
  { name: "--radius-3xl", className: "rounded-3xl" },
  { name: "--radius-4xl", className: "rounded-4xl" },
]

function DesignTokensTab() {
  return (
    <div className="space-y-12">
      {/* Colors */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Colors</h3>
          <p className="text-sm text-muted-foreground">
            CSS custom properties defined in globals.css. Change these to
            rebrand every component at once.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {colorTokens.map((token) => (
            <div key={token.name} className="space-y-1.5 text-center">
              <div
                className={`${token.className} h-16 w-full rounded-md border`}
              />
              <p className="truncate font-mono text-xs text-muted-foreground">
                {token.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Typography</h3>
          <p className="text-sm text-muted-foreground">
            Sora (--font-heading) and Inter (--font-sans)
          </p>
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">h1</p>
            <h1 className="text-4xl font-bold tracking-tight">
              The quick brown fox jumps
            </h1>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">h2</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              The quick brown fox jumps
            </h2>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">h3</p>
            <h3 className="text-2xl font-semibold tracking-tight">
              The quick brown fox jumps
            </h3>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">h4</p>
            <h4 className="text-xl font-semibold tracking-tight">
              The quick brown fox jumps
            </h4>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              body (base)
            </p>
            <p className="text-base leading-7">
              The quick brown fox jumps over the lazy dog. Pack my box with five
              dozen liquor jugs. How vexingly quick daft zebras jump.
            </p>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              small
            </p>
            <p className="text-sm text-muted-foreground">
              The quick brown fox jumps over the lazy dog. Pack my box with five
              dozen liquor jugs.
            </p>
          </div>
          <Separator />
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              mono
            </p>
            <p className="font-mono text-sm">
              const greeting = &quot;Hello, world!&quot;;
            </p>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Spacing Scale</h3>
          <p className="text-sm text-muted-foreground">
            Tailwind default spacing (0.25rem increments)
          </p>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                {n}
              </span>
              <div
                className="h-4 rounded bg-primary"
                style={{ width: `${n * 0.25}rem` }}
              />
              <span className="font-mono text-xs text-muted-foreground">
                {n * 0.25}rem / {n * 4}px
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Border Radius</h3>
          <p className="text-sm text-muted-foreground">
            Derived from the --radius base variable (0.625rem)
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          {radiusTokens.map((token) => (
            <div key={token.name} className="space-y-1.5 text-center">
              <div
                className={`${token.className} h-16 w-16 border-2 border-primary bg-primary/10`}
              />
              <p className="font-mono text-xs text-muted-foreground">
                {token.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 2 – UI Primitives
// ---------------------------------------------------------------------------

function UIPrimitivesTab() {
  return (
    <div className="space-y-16">
      {/* Buttons */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Buttons</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/button
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Settings />
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">States</p>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                With Icon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs & Forms */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Inputs &amp; Forms</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/input, textarea, select, checkbox, switch, label,
            radio-group
          </p>
        </div>
        <div className="grid max-w-xl gap-6">
          <div className="grid gap-2">
            <Label htmlFor="demo-input">Input</Label>
            <Input id="demo-input" placeholder="Type something..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-textarea">Textarea</Label>
            <Textarea
              id="demo-textarea"
              placeholder="Write a longer message..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-select">Select</Label>
            <Select>
              <SelectTrigger id="demo-select" className="w-full">
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-check" />
            <Label htmlFor="demo-check">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="demo-switch" />
            <Label htmlFor="demo-switch">Enable notifications</Label>
          </div>
          <div className="grid gap-2">
            <Label id="radio-group-label">Radio Group</Label>
            <RadioGroup defaultValue="option-one" aria-labelledby="radio-group-label">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Cards</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/card
          </p>
        </div>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              Card description goes here with supporting text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This is the card body content. You can place any elements here.
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Badges</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/badge
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      {/* Avatar */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Avatar</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/avatar
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Sizes</p>
            <div className="flex items-center gap-4">
              <Avatar size="sm">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Avatar"
                />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Group</p>
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>CK</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>+3</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Accordion</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/accordion
          </p>
        </div>
        <Accordion type="single" collapsible className="max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that match the other components.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Tabs (nested) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Tabs</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/tabs
          </p>
        </div>
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <p className="text-sm text-muted-foreground">
              Make changes to your account here.
            </p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-sm text-muted-foreground">
              Change your password here.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Dialog</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/dialog
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. It can contain any content you
                want to show the user.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sheet */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Sheet</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/sheet
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                This is a sheet panel that slides in from the side. Great for
                forms, navigation, or detail views.
              </SheetDescription>
            </SheetHeader>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Sheet body content goes here.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Dropdown Menu */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Dropdown Menu</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/dropdown-menu
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>Shift+P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <DropdownMenuShortcut>Cmd+B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>Cmd+S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>Cmd+K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Team</span>
                <DropdownMenuShortcut>Cmd+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenuShortcut>Shift+Cmd+Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Alerts</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/alert
          </p>
        </div>
        <div className="max-w-lg space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert to inform the user about something
              important.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Table</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/table
          </p>
        </div>
        <div className="max-w-2xl">
          <Table>
            <TableCaption>A list of recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV-001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV-002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV-003</TableCell>
                <TableCell>Unpaid</TableCell>
                <TableCell>Bank Transfer</TableCell>
                <TableCell className="text-right">$350.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Progress</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/progress
          </p>
        </div>
        <Progress value={60} className="max-w-md" />
      </div>

      {/* Skeleton */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Skeleton</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/skeleton
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Separator</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/separator
          </p>
        </div>
        <div className="max-w-md">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Radix Primitives
            </h4>
            <p className="text-sm text-muted-foreground">
              An open-source UI component library.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Tooltip</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/tooltip
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Toggle */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Toggle</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/toggle
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Toggle aria-label="Toggle bold">
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle italic">
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle underline" variant="outline">
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Breadcrumb</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/breadcrumb
          </p>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Navigation Menu */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Navigation Menu</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/navigation-menu
          </p>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4">
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Introduction</div>
                    <p className="text-muted-foreground">
                      Get started with the basics of the platform.
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Installation</div>
                    <p className="text-muted-foreground">
                      How to install and set up your project.
                    </p>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4">
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Buttons</div>
                    <p className="text-muted-foreground">
                      Interactive button components in various styles.
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Cards</div>
                    <p className="text-muted-foreground">
                      Container components for grouping content.
                    </p>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Collapsible */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Collapsible</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/collapsible
          </p>
        </div>
        <Collapsible className="max-w-sm space-y-2">
          <div className="flex items-center justify-between rounded-md border px-4 py-2">
            <span className="text-sm font-medium">3 items available</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-2 text-sm">
              Item one
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              Item two
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              Item three
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Hover Card */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Hover Card</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/hover-card
          </p>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="px-0">
              @shadcn
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">shadcn/ui</h4>
              <p className="text-sm text-muted-foreground">
                Beautifully designed components built with Radix UI and Tailwind
                CSS. Open source and free to use.
              </p>
              <p className="text-xs text-muted-foreground">
                Joined December 2021
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Scroll Area */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Scroll Area</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/scroll-area
          </p>
        </div>
        <ScrollArea className="h-48 max-w-xs rounded-md border p-4">
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`scroll-item-${i}`} className="text-sm">
                Item {i + 1} &mdash; Scrollable content area
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Toggle Group */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Toggle Group</h3>
          <p className="text-sm text-muted-foreground">
            @/components/ui/toggle-group
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Single select</p>
            <ToggleGroup type="single" defaultValue="center">
              <ToggleGroupItem value="left" aria-label="Align left">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                Center
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Multiple select</p>
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 3 – Page Sections
// ---------------------------------------------------------------------------

const sections = [
  { name: "Banner", file: "banner", component: <Banner /> },
  { name: "HeroCentered", file: "hero-centered", component: <HeroCentered /> },
  { name: "HeroSplit", file: "hero-split", component: <HeroSplit /> },
  { name: "LogoCloud", file: "logo-cloud", component: <LogoCloud /> },
  { name: "FeatureGrid", file: "feature-grid", component: <FeatureGrid /> },
  { name: "FeatureRows", file: "feature-rows", component: <FeatureRows /> },
  { name: "Comparison", file: "comparison", component: <Comparison /> },
  { name: "HowItWorks", file: "how-it-works", component: <HowItWorks /> },
  { name: "Stats", file: "stats", component: <Stats /> },
  {
    name: "TestimonialCards",
    file: "testimonial-cards",
    component: <TestimonialCards />,
  },
  {
    name: "TestimonialSingle",
    file: "testimonial-single",
    component: <TestimonialSingle />,
  },
  {
    name: "PricingCards",
    file: "pricing-cards",
    component: <PricingCards />,
  },
  {
    name: "PricingToggle",
    file: "pricing-toggle",
    component: <PricingToggle />,
  },
  { name: "Faq", file: "faq", component: <Faq /> },
  { name: "CtaSimple", file: "cta-simple", component: <CtaSimple /> },
  { name: "CtaSplit", file: "cta-split", component: <CtaSplit /> },
  { name: "TeamGrid", file: "team-grid", component: <TeamGrid /> },
  {
    name: "FounderLetter",
    file: "founder-letter",
    component: <FounderLetter />,
  },
  { name: "BlogGrid", file: "blog-grid", component: <BlogGrid /> },
  { name: "ContactForm", file: "contact-form", component: <ContactForm /> },
  { name: "VideoEmbed", file: "video-embed", component: <VideoEmbed /> },
  {
    name: "IntegrationGrid",
    file: "integration-grid",
    component: <IntegrationGrid />,
  },
  { name: "Newsletter", file: "newsletter", component: <Newsletter /> },
  {
    name: "CookieConsent",
    file: "cookie-consent",
    component: <CookieConsent />,
  },
]

function PageSectionsTab() {
  return (
    <div>
      {sections.map((section) => (
        <div key={section.file}>
          <div className="border-t pt-4 mt-12">
            <p className="text-sm font-mono text-muted-foreground mb-2">
              @/components/sections/{section.file}
            </p>
            <h3 className="text-lg font-semibold mb-6">{section.name}</h3>
          </div>
          {section.component}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab 4 – Relume Sections
// ---------------------------------------------------------------------------

const relumeSections = [
  { name: "HeroVideo", file: "hero-video", component: <HeroVideo /> },
  { name: "FeatureTabs", file: "feature-tabs", component: <FeatureTabs /> },
  {
    name: "FeatureAccordion",
    file: "feature-accordion",
    component: <FeatureAccordion />,
  },
  {
    name: "TestimonialCarousel",
    file: "testimonial-carousel",
    component: <TestimonialCarousel />,
  },
  { name: "LogoCarousel", file: "logo-carousel", component: <LogoCarousel /> },
  { name: "CountdownCta", file: "countdown-cta", component: <CountdownCta /> },
  {
    name: "CaseStudyCarousel",
    file: "case-study-carousel",
    component: <CaseStudyCarousel />,
  },
  {
    name: "VideoTestimonial",
    file: "video-testimonial",
    component: <VideoTestimonial />,
  },
  { name: "GalleryGrid", file: "gallery-grid", component: <GalleryGrid /> },
  { name: "CareerList", file: "career-list", component: <CareerList /> },
]

function RelumeSectionsTab() {
  return (
    <div>
      {relumeSections.map((section) => (
        <div key={section.file}>
          <div className="border-t pt-4 mt-12">
            <p className="text-sm font-mono text-muted-foreground mb-2">
              @/components/relume/{section.file}
            </p>
            <h3 className="text-lg font-semibold mb-6">{section.name}</h3>
          </div>
          {section.component}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Component Library
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse design tokens, UI primitives, and page sections. Change CSS
            variables in globals.css to see your brand cascade through every
            component.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
            <TabsTrigger value="primitives">UI Primitives</TabsTrigger>
            <TabsTrigger value="sections">Page Sections</TabsTrigger>
            <TabsTrigger value="relume">Relume</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            <DesignTokensTab />
          </TabsContent>

          <TabsContent value="primitives">
            <UIPrimitivesTab />
          </TabsContent>

          <TabsContent value="sections">
            <PageSectionsTab />
          </TabsContent>

          <TabsContent value="relume">
            <RelumeSectionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
