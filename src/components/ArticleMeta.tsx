import { User, Calendar, ShieldCheck } from 'lucide-react';

type ArticleMetaProps = {
  date: string;
};

export default function ArticleMeta({ date }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-1.5">
        <User className="w-4 h-4" />
        <span>Por Joel Marcos (CRECI 39.583F)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4" />
        <span>Última revisão: {date}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-600">
        <ShieldCheck className="w-4 h-4 text-success" />
        <span>Revisão Técnica</span>
      </div>
    </div>
  );
}
