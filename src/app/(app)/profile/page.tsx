import { users } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AtSign, Clock, Edit, UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const user = users[0]; // Using a mock user

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Your Profile</h1>
            <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
            </Button>
        </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-2xl font-semibold font-headline">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Work Preferences</CardTitle>
          <CardDescription>How you like to work with your team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold">Timezone</h3>
                    <p className="text-muted-foreground">{user.timezone}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <UserCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                    <h3 className="font-semibold">Communication & Work Style</h3>
                    <p className="text-muted-foreground">{user.workStyle}</p>
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
