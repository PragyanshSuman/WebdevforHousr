import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from 'react-toastify';
import { useAuth } from '../App';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (username: string, email: string, password: string, role: 'USER' | 'BROKER') => {
    try {
      await signup(username, email, password, role);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to SRM Accommodation Finder</CardTitle>
          <CardDescription>Access your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLogin={handleLogin} onSignupClick={() => setActiveTab('signup')} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSignup={handleSignup} onSuccess={() => {
                toast.success("Signup successful! Please log in.");
                setActiveTab('login');
              }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

const LoginForm: React.FC<{ onLogin: (username: string, password: string) => Promise<void>, onSignupClick: () => void }> = ({ onLogin, onSignupClick }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">Login</Button>
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Button variant="link" onClick={onSignupClick} className="p-0">
          Sign up here
        </Button>
      </p>
    </form>
  )
}

const SignupForm: React.FC<{ onSignup: (username: string, email: string, password: string, role: 'USER' | 'BROKER') => Promise<void>, onSuccess: () => void }> = ({ onSignup, onSuccess }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'USER' | 'BROKER'>('USER')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await onSignup(username, email, password, role)
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="signup-username">Username</Label>
        <Input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setRole(value as 'USER' | 'BROKER')}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">Student</SelectItem>
            <SelectItem value="BROKER">Property Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  )
}

export default LoginPage;