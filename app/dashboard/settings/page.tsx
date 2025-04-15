import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateProfile } from "./components/update-profile"
import { UpdatePassword } from "./components/update-password"
import { DeleteAccount } from "./components/delete-account"

const SettingsPage = () => {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account settings and set preferences.</p>
        </div>
        <Tabs defaultValue="profile" className="w-[400px]">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 overflow-x-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <UpdateProfile />
          </TabsContent>
          <TabsContent value="password">
            <UpdatePassword />
          </TabsContent>
          <TabsContent value="account">
            <DeleteAccount />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SettingsPage
