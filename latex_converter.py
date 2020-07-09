import matplotlib.pyplot as plt
import numpy as np

def convert_tex_document(filename):
        import tex2pix
        f = open(filename)
        r = tex2pix.Renderer(f)
        r.mkpdf(filename.replace(".tex", ".pdf"))

def convert_coords_map(mat, timestamp):
        import matplotlib.pyplot as plt
        import numpy as np
        from matplotlib.colors import LogNorm

        fig, ax = plt.subplots(1, 1)

        c = ax.pcolor(mat, edgecolors='w', cmap='inferno', linewidths=4)
        ax.set_title('Representação do mapeamento de sala')

        fig.tight_layout()
        plt.savefig(str(timestamp)+'.pdf')

if __name__=="__main__":
    distances_draw(" 0011209.json")