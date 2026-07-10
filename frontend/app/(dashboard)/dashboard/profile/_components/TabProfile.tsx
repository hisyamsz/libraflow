import { ShieldAlert, KeyRound, Mail, Phone, UserCheck, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { formatRole } from "@/lib/utils";

export default function TabProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="max-w-3xl w-full bg-card/75 dark:bg-card/45 border-border/50 dark:border-white/5 shadow-sm backdrop-blur-md">
      <CardContent className="px-6 py-4 sm:px-8 sm:py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                <p className="text-sm font-semibold">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Alamat Email</p>
                <p className="text-sm font-semibold">
                  {user.email || <span className="italic text-muted-foreground font-normal">-</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                <p className="text-sm font-semibold">
                  {user.phone || <span className="italic text-muted-foreground font-normal">-</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Peran / Hak Akses</p>
                <p className="text-sm font-semibold">{formatRole(user.role)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Nomor Induk Siswa (NIS)</p>
                <p className="text-sm font-semibold">{user.nis || "-"}</p>
              </div>
            </div>
            {user.class && (
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Kelas</p>
                  <p className="text-sm font-semibold">{user.class}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
