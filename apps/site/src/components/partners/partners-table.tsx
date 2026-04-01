import { TooltipInfo } from "@prisma-docs/ui/components/tooltip-info";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@prisma/eclipse";

export function PartnersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="bg-transparent border-r"> </TableHead>
          <TableHead className="border-r">Entry</TableHead>
          <TableHead className="border-r">Growth</TableHead>
          <TableHead className="border-r">Scale</TableHead>
          <TableHead>Reseller</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Max Databases
          </TableCell>
          <TableCell className="border-r">5,000/month</TableCell>
          <TableCell className="border-r">50,000/month</TableCell>
          <TableCell className="border-r">Custom</TableCell>
          <TableCell>Custom</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Per Database Limits
          </TableCell>
          <TableCell className="border-r">
            100K ops/month, 1GB storage
          </TableCell>
          <TableCell className="border-r">
            100K ops/month, 1GB storage
          </TableCell>
          <TableCell className="border-r">
            100K ops/month, 1GB storage
          </TableCell>
          <TableCell>Custom</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Database Ownership
          </TableCell>
          <TableCell className="border-r">Transferable to end user</TableCell>
          <TableCell className="border-r">Transferable to end user</TableCell>
          <TableCell className="border-r">Transferable to end user</TableCell>
          <TableCell>Non-transferable</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Partner Revenue Share
          </TableCell>
          <TableCell className="border-r">
            <div className="flex items-center gap-2">
              <span>10%</span>
              <TooltipInfo text="With 1,000 customers on the Pro plan ($49) → 1,000 * $49 * 10% = $4,900 / month" />
            </div>
          </TableCell>
          <TableCell className="border-r">
            <div className="flex items-center gap-2">
              <span>15%</span>
              <TooltipInfo text="With a 1,000 customers on the Pro plan ($49) → 1,000 * $49 * 15% = $7,350 / month" />
            </div>
          </TableCell>
          <TableCell className="border-r">
            <div className="flex items-center gap-2">
              <span>20%</span>
              <TooltipInfo text="With a 1,000 customers on the Pro plan ($49) → 1,000 * $49 * 20% = $9,800 / month" />
            </div>
          </TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Studio White-labeling
          </TableCell>
          <TableCell className="border-r">Prisma branding</TableCell>
          <TableCell className="border-r">Your branding</TableCell>
          <TableCell className="border-r">Your branding</TableCell>
          <TableCell>Your branding</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">
            Contract Length
          </TableCell>
          <TableCell className="border-r">-</TableCell>
          <TableCell className="border-r">12 months</TableCell>
          <TableCell className="border-r">12 months</TableCell>
          <TableCell>24 months</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold border-r">Get Started</TableCell>
          <TableCell className="border-r">
            <a href="#" className="link-btn orm">
              Get in touch
            </a>
          </TableCell>
          <TableCell className="border-r">
            <a href="#" className="link-btn orm">
              Get in touch
            </a>
          </TableCell>
          <TableCell className="border-r">
            <a href="#" className="link-btn orm">
              Get in touch
            </a>
          </TableCell>
          <TableCell>
            <a href="#" className="link-btn orm">
              Get in touch
            </a>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
