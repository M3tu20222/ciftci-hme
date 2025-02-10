export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-bold text-center mb-12 text-neon-pink title-glow">
        Çiftçilik Sistemine Hoş Geldiniz
      </h1>
      <p className="text-neon-cyan text-center text-xl">
        Bu sistem, çiftçilik işlemlerinizi yönetmenize yardımcı olur.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-neon-blue">
          <h2 className="text-2xl font-bold mb-4 text-neon-green">
            Envanter Yönetimi
          </h2>
          <p className="text-neon-cyan">
            Ürünlerinizi ve ekipmanlarınızı kolayca takip edin.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-neon-blue">
          <h2 className="text-2xl font-bold mb-4 text-neon-green">
            Finansal Takip
          </h2>
          <p className="text-neon-cyan">
            Gelir ve giderlerinizi anlık olarak izleyin.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-neon-blue">
          <h2 className="text-2xl font-bold mb-4 text-neon-green">
            Tarla Yönetimi
          </h2>
          <p className="text-neon-cyan">
            Tarlalarınızı ve ekinlerinizi etkin bir şekilde yönetin.
          </p>
        </div>
      </div>
    </div>
  );
}
