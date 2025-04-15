import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Billing",
}

const BillingPage = () => {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <Button>Upgrade Plan</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>$29.99 on January 26, 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visa ending in 1234</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div>Billing history content</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BillingPage
