import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "./components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-5xl font-bold text-center text-neon-pink title-glow">
          Çiftçilik Sistemine Hoş Geldiniz
        </h1>
        <p className="text-xl text-center text-neon-cyan">
          Bu sistem, çiftçilik işlemlerinizi yönetmenize yardımcı olur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gray-800 border-2 border-neon-green hover:shadow-neon-green transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-neon-green">
                Envanter Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-cyan">
                Ürünlerinizi ve ekipmanlarınızı kolayca takip edin.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-neon-pink hover:shadow-neon-pink transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-neon-pink">Finansal Takip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-cyan">
                Gelir ve giderlerinizi anlık olarak izleyin.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-neon-blue hover:shadow-neon-blue transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-neon-blue">Tarla Yönetimi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-cyan">
                Tarlalarınızı ve ekinlerinizi etkin bir şekilde yönetin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
